# Setup/Maintenance Plugin

## Entering/Exiting This Phase
- **Enter if**: `.memorybankrules` shows `current_phase: "Set-up/Maintenance"` or is missing
- **Exit when**: All core files exist, trackers are populated (no placeholders)
- **Exit action**: Update `.memorybankrules` with `next_phase: "Strategy"`

## Core File Initialization
1. Check existence of:
   - `.memorybankrules`
   - `projectbrief.md`
   - `productContext.md`
   - `activeContext.md`
   - `dependency_tracker.md`
   - `changelog.md`
   - `doc_tracker.md`

2. Create missing files:
   - For standard files: Create with basic template (e.g., `# Project Brief` for `projectbrief.md`)
   - For trackers: Create using tracker format (see below)

3. Initial `.memorybankrules` template:
   ```
   ---CLINE_RULES_START---
   [LAST_ACTION_STATE]
   last_action: "System Initialized"
   current_phase: "Set-up/Maintenance"
   next_action: "Initialize Core Files"
   next_phase: "Set-up/Maintenance"
   
   [CODE_ROOT_DIRECTORIES]
   - src
   - tests
   
   [LEARNING_JOURNAL]
   - Initial setup on DATE.
   ---CLINE_RULES_END---
   ```

## Identify Code Root Directories
1. Scan project root directory
2. Include directories with source code (e.g., `src`, `lib`, etc.)
3. Exclude utility directories (`.git`, `.vscode`, etc.)
4. Update `.memorybankrules` [CODE_ROOT_DIRECTORIES] section

## Dependency Tracker Creation
1. Create initial tracker:
   ```
   ---TRACKER_START---
   # No dependencies identified yet
   ---TRACKER_END---
   
   ---KEYS_START---
   # No modules identified yet
   ---KEYS_END---
   ```

2. Scan code directories to identify modules and files
3. Update trackers by adding module entries:
   ```
   m1: src/module_a
   m2: src/module_b
   ```

4. Analyze code to identify dependencies:
   - Imports between modules
   - Function calls between modules
   - Documentation references
   
5. Add dependencies using format:
   ```
   module_a = REQ:module_b,module_c DOC:doc_1
   ```

## Setup/Maintenance MUP
After each significant action:
1. Update `activeContext.md` with action taken and current state
2. Update `changelog.md` for created/modified files
3. Update `.memorybankrules`:
   ```
   last_action: "Populated dependency trackers"
   current_phase: "Set-up/Maintenance"
   next_action: "Complete Setup Phase"
   next_phase: "Set-up/Maintenance"
   ```

## Exit Checklist
Before transitioning to Strategy phase:
- All core files exist and are initialized
- Code root directories are identified
- Dependency trackers are populated with no placeholders
- `.memorybankrules` is updated with next phase "Strategy"