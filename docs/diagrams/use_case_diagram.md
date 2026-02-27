%% Define Use Cases
Move((Move Robot))
Status((View Status))
Reset((Reset Robot))

%% Connect Actors to Use Cases
C --> Move
C --> Status
V --> Status
A --> Reset
