// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type Listener = () => void;

let open = false;
let guideSrc = '';
const listeners = new Set<Listener>();

function emit() {
    listeners.forEach((listener) => listener());
}

export function isLearningOpen() {
    return open;
}

export function getLearningSrc() {
    return guideSrc;
}

export function openLearning(src = '') {
    guideSrc = src;
    if (open) {
        emit();
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
    guideSrc = '';
    emit();
}

export function toggleLearning() {
    if (open) {
        closeLearning();
        return;
    }
    openLearning();
}

export function subscribeLearning(listener: Listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
