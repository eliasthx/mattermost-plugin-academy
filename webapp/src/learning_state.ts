// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type Listener = () => void;

let open = false;
const listeners = new Set<Listener>();

function emit() {
    listeners.forEach((listener) => listener());
}

export function isLearningOpen() {
    return open;
}

export function openLearning() {
    if (open) {
        return;
    }
    open = true;
    emit();
}

export function closeLearning() {
    if (!open) {
        return;
    }
    open = false;
    emit();
}

export function toggleLearning() {
    open = !open;
    emit();
}

export function subscribeLearning(listener: Listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
