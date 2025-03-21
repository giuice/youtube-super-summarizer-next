# Strategy Plugin

## Entering/Exiting This Phase
- **Enter if**: `.memorybankrules` shows `current_phase: "Strategy"` or transitioning from Setup/Maintenance
- **Exit when**: Instruction files are created with complete steps and dependencies, tasks are prioritized
- **Exit action**: Update `.memorybankrules` with `next_phase: "Execution"`

## Context Loading
1. Read core files:
   - `.memorybankrules`
   - `projectbrief.md`
   - `productContext.md`
   - `activeContext.md`
   - `dependency_tracker.md`
   - `changelog.md`
   - `doc_tracker.md`
   
2. Review `activeContext.md` for current state and priorities
3. Check dependency trackers for module/file relationships
4. Review project objectives from `projectbrief.md`

## Creating Task Instruction Files
1. Identify task/subtask based on:
   - `projectbrief.md` objectives
   - `activeContext.md` priorities
   - Dependencies from `dependency_tracker.md`

2. Choose task name and location:
   - **Task**: Create `{task_name}_instructions.txt` in `memory-bank/strategy_tasks/`
   - **Subtask**: Place in parent task subdirectory
   - **Module-level**: Create `{module_dir}/{module_dir}_main_instructions.txt`

3. Populate instruction file sections:
   - Title: `# {Task Name} Instructions`
   - Objective: Clear statement of purpose and goals
   - Context: Background, constraints, references
   - Dependencies: List required modules/files using IDs from trackers
   - Steps: Break into actionable increments
   - Expected Output: Describe deliverables
   - Notes: Additional considerations

4. For module-level tasks, include mini dependency tracker:
   ```
   ## Mini Dependency Tracker
   ---TRACKER_START---
   file_a = REQ:file_b,file_c
   file_b = REQ:file_d PROV:file_a
   ---TRACKER_END---
   ```

## Task Prioritization Process
1. Review existing instruction files
2. Assess dependencies from trackers to identify prerequisite tasks
3. Align with project objectives from `projectbrief.md`
4. Consider recent priorities from `activeContext.md`
5. Create priority ranking of tasks
6. Document prioritization reasoning in `activeContext.md`

## Recursive Task Decomposition
For complex tasks:
1. Analyze complexity and scope
2. If too large, identify logical subtasks
3. Create instruction file for each subtask
4. Define dependencies between subtasks
5. Update parent task to reference subtasks
6. Document decomposition in `activeContext.md`

## Strategy MUP
After task planning actions:
1. Update instruction files with latest changes
2. Update `activeContext.md` with:
   - Summary of planned tasks
   - List of instruction file locations
   - Task priorities and reasoning
3. Update `.memorybankrules`:
   ```
   [LAST_ACTION_STATE]
   last_action: "Completed Strategy Phase - Tasks Planned"
   current_phase: "Strategy"
   next_action: "Phase Complete - User Action Required"
   next_phase: "Execution"
   ```
4. Update `changelog.md` for significant strategy decisions

## Exit Checklist
Before transitioning to Execution phase:
- All instruction files contain complete steps
- Dependencies are clearly defined
- Tasks are prioritized
- Recursive decomposition is complete where needed
- `.memorybankrules` is updated with next phase "Execution"

## Process Flow
```
1. Load Context → 
2. Identify Tasks → 
3. Create Instruction Files → 
4. Prioritize → 
5. Decompose Complex Tasks → 
6. Update MUP → 
7. Exit Phase
```