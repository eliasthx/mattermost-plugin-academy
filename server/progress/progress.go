// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package progress

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/mattermost/mattermost/server/public/pluginapi"
)

const (
	keyPrefix      = "progress:"
	statsKeyPrefix = "stats:ever_completed:"
)

// Record is one user's progress for a single guide.
// Completed modules are stored by stable string IDs (not indexes) so guides
// can add, remove, or reorder modules without invalidating saved progress.
type Record struct {
	V                  int      `json:"v"`
	GuideID            string   `json:"guideId"`
	CompletedModuleIDs []string `json:"completedModuleIds"`
	UpdatedAt          int64    `json:"updatedAt"`
	// EverCompleted is set the first time the user completes every module in
	// the curriculum they sent. Kept for reporting even if modules are added later.
	EverCompleted bool  `json:"everCompleted"`
	CompletedAt   int64 `json:"completedAt,omitempty"`
}

// PutRequest is the body for saving progress.
// ModuleIDs is the guide's current curriculum (stable IDs) used only to decide
// whether the guide is fully complete right now.
type PutRequest struct {
	CompletedModuleIDs []string `json:"completedModuleIds"`
	ModuleIDs          []string `json:"moduleIds"`
}

// Store reads/writes progress in the plugin KV store.
type Store struct {
	client *pluginapi.Client
}

func NewStore(client *pluginapi.Client) *Store {
	return &Store{client: client}
}

func progressKey(userID, guideID string) string {
	return keyPrefix + userID + ":" + guideID
}

func statsKey(guideID string) string {
	return statsKeyPrefix + guideID
}

func normalizeIDs(ids []string) []string {
	seen := make(map[string]struct{}, len(ids))
	out := make([]string, 0, len(ids))
	for _, id := range ids {
		id = strings.TrimSpace(id)
		if id == "" {
			continue
		}
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		out = append(out, id)
	}
	sort.Strings(out)
	return out
}

func containsAll(have []string, need []string) bool {
	if len(need) == 0 {
		return false
	}
	set := make(map[string]struct{}, len(have))
	for _, id := range have {
		set[id] = struct{}{}
	}
	for _, id := range need {
		if _, ok := set[id]; !ok {
			return false
		}
	}
	return true
}

// Get returns progress for a user/guide, or an empty record if none exists.
func (s *Store) Get(userID, guideID string) (Record, error) {
	var rec Record
	if err := s.client.KV.Get(progressKey(userID, guideID), &rec); err != nil {
		return Record{}, err
	}
	if rec.V == 0 && rec.GuideID == "" && len(rec.CompletedModuleIDs) == 0 {
		return Record{
			V:                  1,
			GuideID:            guideID,
			CompletedModuleIDs: []string{},
		}, nil
	}
	if rec.CompletedModuleIDs == nil {
		rec.CompletedModuleIDs = []string{}
	}
	return rec, nil
}

// ListForUser returns progress for all guides for a user (prefix scan).
func (s *Store) ListForUser(userID string) (map[string]Record, error) {
	prefix := keyPrefix + userID + ":"
	out := map[string]Record{}

	// ListKeys' WithPrefix filters within each page of all keys, so we page the
	// full keyspace and match the prefix ourselves to avoid stopping early.
	for page := 0; ; page++ {
		keys, err := s.client.KV.ListKeys(page, 100)
		if err != nil {
			return nil, err
		}
		if len(keys) == 0 {
			break
		}
		for _, key := range keys {
			if !strings.HasPrefix(key, prefix) {
				continue
			}
			guideID := strings.TrimPrefix(key, prefix)
			if guideID == "" || strings.Contains(guideID, ":") {
				continue
			}
			rec, err := s.Get(userID, guideID)
			if err != nil {
				return nil, err
			}
			out[guideID] = rec
		}
		if len(keys) < 100 {
			break
		}
	}
	return out, nil
}

// Put merges completed module IDs and updates ever-completed / stats when appropriate.
func (s *Store) Put(userID, guideID string, req PutRequest) (Record, error) {
	key := progressKey(userID, guideID)
	now := time.Now().Unix()

	completed := normalizeIDs(req.CompletedModuleIDs)
	curriculum := normalizeIDs(req.ModuleIDs)

	var next Record
	becameComplete := false

	err := s.client.KV.SetAtomicWithRetries(key, func(oldValue []byte) (any, error) {
		var prev Record
		if len(oldValue) > 0 {
			if err := json.Unmarshal(oldValue, &prev); err != nil {
				return nil, err
			}
		}

		merged := normalizeIDs(append(prev.CompletedModuleIDs, completed...))
		next = Record{
			V:                  1,
			GuideID:            guideID,
			CompletedModuleIDs: merged,
			UpdatedAt:          now,
			EverCompleted:      prev.EverCompleted,
			CompletedAt:        prev.CompletedAt,
		}

		if !prev.EverCompleted && containsAll(merged, curriculum) {
			next.EverCompleted = true
			next.CompletedAt = now
			becameComplete = true
		}

		return next, nil
	})
	if err != nil {
		return Record{}, err
	}

	if becameComplete {
		if err := s.incrementEverCompleted(guideID); err != nil {
			s.client.Log.Warn("Failed to increment guide completion stats", "guide_id", guideID, "error", err.Error())
		}
	}

	return next, nil
}

func (s *Store) incrementEverCompleted(guideID string) error {
	key := statsKey(guideID)
	return s.client.KV.SetAtomicWithRetries(key, func(oldValue []byte) (any, error) {
		var n int64
		if len(oldValue) > 0 {
			if err := json.Unmarshal(oldValue, &n); err != nil {
				return nil, err
			}
		}
		return n + 1, nil
	})
}

// EverCompletedCount returns how many users have ever completed the guide.
func (s *Store) EverCompletedCount(guideID string) (int64, error) {
	var n int64
	if err := s.client.KV.Get(statsKey(guideID), &n); err != nil {
		return 0, err
	}
	return n, nil
}

// Handler serves progress HTTP APIs under /api/v1/progress.
type Handler struct {
	store *Store
}

func NewHandler(store *Store) *Handler {
	return &Handler{store: store}
}

func userIDFromRequest(r *http.Request) string {
	return r.Header.Get("Mattermost-User-Id")
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

// ServeHTTP handles:
//
//	GET  /api/v1/progress
//	GET  /api/v1/progress/{guideId}
//	PUT  /api/v1/progress/{guideId}
func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromRequest(r)
	if userID == "" {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api/v1/progress")
	path = strings.Trim(path, "/")

	switch {
	case path == "" && r.Method == http.MethodGet:
		records, err := h.store.ListForUser(userID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to list progress")
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"guides": records})
		return

	case path != "" && !strings.Contains(path, "/"):
		guideID := path
		if !validGuideID(guideID) {
			writeError(w, http.StatusBadRequest, "invalid guide id")
			return
		}

		switch r.Method {
		case http.MethodGet:
			rec, err := h.store.Get(userID, guideID)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "failed to get progress")
				return
			}
			writeJSON(w, http.StatusOK, rec)
			return

		case http.MethodPut:
			var req PutRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				writeError(w, http.StatusBadRequest, "invalid json")
				return
			}
			rec, err := h.store.Put(userID, guideID, req)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "failed to save progress")
				return
			}
			writeJSON(w, http.StatusOK, rec)
			return

		default:
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
	}

	writeError(w, http.StatusNotFound, "not found")
}

func validGuideID(id string) bool {
	if id == "" || len(id) > 128 {
		return false
	}
	for _, r := range id {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
			continue
		}
		return false
	}
	return true
}
