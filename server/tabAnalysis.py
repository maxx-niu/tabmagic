# gets the key of the piece.
def getKey():
  ...

# gets the chord progression of the piece, from bar -> bar
def getChords():
  ...

# analyze continous sequences of notes for scales.
# support: major, minor, modes, pentatonic, blues, (i.e. commonly used scales)
def detectScales():
  ...

# given a sequence of notes, suggest optimal fingerings.
def suggestFingerPlacement():
  ...