NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

# Standard tuning indexed by guitar string letter (high e to low E)
STANDARD_TUNING = {'e': 'E4', 'B': 'B3', 'G': 'G3', 'D': 'D3', 'A': 'A2', 'E': 'E2'}

CHORD_TEMPLATES = {
    'major':      [0, 4, 7],
    'minor':      [0, 3, 7],
    'dominant7':  [0, 4, 7, 10],
    'major7':     [0, 4, 7, 11],
    'minor7':     [0, 3, 7, 10],
    'diminished': [0, 3, 6],
    'augmented':  [0, 4, 8],
}

MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]


def fret_to_note(string: str, fret: int) -> str:
    """Convert a (string, fret) pair to a note name. String is a letter key: e, B, G, D, A, E."""
    open_note = STANDARD_TUNING[string]
    semitone = NOTES.index(open_note[:-1]) + fret
    return NOTES[semitone % 12]


def identify_chord(notes: list) -> str:
    """Given a list of note name strings, identify the chord."""
    semitones = list({NOTES.index(n) for n in notes})
    for root in semitones:
        intervals = sorted([(s - root) % 12 for s in semitones])
        for name, template in CHORD_TEMPLATES.items():
            if intervals == template:
                return f"{NOTES[root]} {name}"
    return "unknown"


def getKey(all_notes: list) -> str:
    """Identify the key of the piece using the Krumhansl-Schmuckler algorithm."""
    if not all_notes:
        return "unknown"
    pitch_counts = [0] * 12
    for note in all_notes:
        pitch_counts[NOTES.index(note)] += 1

    best_score, best_key = -1, "unknown"
    for tonic in range(12):
        for mode, profile in [("major", MAJOR_PROFILE), ("minor", MINOR_PROFILE)]:
            rotated = profile[tonic:] + profile[:tonic]
            score = sum(a * b for a, b in zip(pitch_counts, rotated))
            if score > best_score:
                best_score, best_key = score, f"{NOTES[tonic]} {mode}"
    return best_key


def getChords(bars: list) -> list:
    """
    Given a list of bars (each bar is a list of simultaneous note groups),
    return a chord name per bar.
    """
    chords = []
    for bar_notes in bars:
        # Flatten all notes in the bar to identify the overall chord
        all_bar_notes = [note for group in bar_notes for note in group]
        chords.append(identify_chord(all_bar_notes) if all_bar_notes else "unknown")
    return chords
