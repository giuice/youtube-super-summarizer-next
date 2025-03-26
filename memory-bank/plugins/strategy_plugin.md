# STRATEGY PLUGIN

╔═══════════════════════════════════════════════════════════╗
║                       STRATEGY                             ║
║                                                           ║
║  Identify  -->  Create     -->  Prioritize  -->  Decompose ║
║  Tasks         Instructions     Tasks          Complex Tasks║
╚═══════════════════════════════════════════════════════════╝

## ENTERING/EXITING THIS PHASE

**Enter if**:
- `.memorybankrules` shows `CURRENT: Strategy`
- Transitioning from Setup/Maintenance

**Exit when**:
- All instruction files are created with complete steps
- Dependencies are clearly defined
- Tasks are prioritized and ready for execution

**Exit action**:
```
[PHASE_MARKER]
CURRENT: Strategy
NEXT: Execution
LAST_ACTION: Completed Strategy Phase - Tasks Planned
REQUIRED_BEFORE_TRANSITION: User Action Required
[/PHASE_MARKER]
```

## CONTEXT LOADING

1. Read core files:
   - `.memorybankrules`
   - `memory-bank/projectbrief.md`
   - `memory-bank/productContext.md`
   - `memory-bank/activeContext.md`
   - `memory-bank/dependency_tracker.md`
   - `memory-bank/changelog.md`
   - `docs/doc_tracker.md`
   
2. Review `activeContext.md` for current state and priorities
3. Check dependency trackers for module/file relationships
4. Review project objectives from `projectbrief.md`

## TASK INSTRUCTION FILE CREATION

1. Identify task/subtask based on:
   - `projectbrief.md` objectives
   - `activeContext.md` priorities
   - Dependencies from trackers

2. Create file with correct naming convention:
   ```
   T{number}_{task_name}_instructions.txt
   ```
   For example: `T1_DatabaseSetup_instructions.txt`

3. Populate instruction file with required sections:
   ```
   # {Task Name} Instructions
   
   ## Objective
   [Clear statement of purpose]
   
   ## Context
   [Background information]
   
   ## Dependencies
   [List of required modules/files with keys]
   
   ## Steps
   1. [First step]
   2. [Second step]
   ...
   
   ## Expected Output
   [Description of deliverables]
   
   ## Notes
   [Additional considerations]
   ```

4. For module-level tasks, include mini dependency tracker at end:
   ```
   ## Mini Dependency Tracker
   [DEP_MATRIX_START]
   # KEY DEFINITIONS
   K1: module_name/file1.py
   K2: module_name/file2.py
   
   # MATRIX
       | K1 | K2 |
   K1  | -  | >  |
   K2  | <  | -  |
   [DEP_MATRIX_END]
   ```

## TASK PRIORITIZATION

1. Review existing instruction files
2. Assess dependencies from trackers to identify prerequisite tasks
3. Align with project objectives from `projectbrief.md`
4. Consider recent priorities from `activeContext.md`
5. Document prioritization in `activeContext.md`:
   ```
   ## Task Priorities
   1. T1_DatabaseSetup (Highest) - Required for all other tasks
   2. T2_UserAuthentication (High) - Security requirement
   3. T3_UIComponents (Medium) - Can be started in parallel
   ```

## RECURSIVE TASK DECOMPOSITION

For complex tasks:
1. Analyze complexity and scope
2. If too large, identify logical subtasks
3. Create instruction file for each subtask following naming convention:
   ```
   T{parent_number}_{parent_name}_ST{subtask_number}_{subtask_name}_instructions.txt
   ```
   For example: `T1_DatabaseSetup_ST1_SchemaDesign_instructions.txt`

4. Define dependencies between subtasks
5. Update parent task to reference subtasks
6. Document decomposition in `activeContext.md`

## STRATEGY MUP ADDITIONS

In addition to core MUP checklist, also verify:
[ ] 6. Task instructions follow naming convention
[ ] 7. All task instructions have complete sections
[ ] 8. Task priorities are documented

## CHECKPOINTS BEFORE TRANSITION

[TRANSITION_CHECKLIST]
[ ] All identified tasks have instruction files
[ ] All instruction files have complete sections
[ ] Dependencies are clearly specified
[ ] Task priorities are documented
[ ] Complex tasks are decomposed if needed
[ ] `.memorybankrules` updated with NEXT: Execution
[/TRANSITION_CHECKLIST]

## REQUIRED RESPONSE FORMAT

All responses after an action MUST end with:

[MUP_VERIFICATION]
[X] 1. Updated activeContext.md with: [brief description]
[X] 2. Updated changelog.md: [Yes/No + reason]
[X] 3. Updated phase marker with last_action: [action description]
[X] 4. Verified next action is correct: [next action]
[X] 5. Checked if phase transition is needed: [Yes/No + reason]
[X] 6. Task instructions follow naming convention: [Yes/No + details]
[X] 7. All task instructions have complete sections: [Yes/No + details]
[X] 8. Task priorities are documented: [Yes/No + details]
[/MUP_VERIFICATION]