# Execution Plugin

## Entering/Exiting This Phase
- **Enter if**: `.memorybankrules` shows `current_phase: "Execution"` or transitioning from Strategy
- **Exit when**: All steps in instruction files are executed, outputs generated, results documented
- **Exit action**: Update `.memorybankrules` with `next_phase: "Strategy"` (for next cycle) or `"Project Complete"`

## Context Loading
1. Read core files:
   - `.memorybankrules`
   - `projectbrief.md`
   - `productContext.md`
   - `activeContext.md`
   - `dependency_tracker.md`
   - `changelog.md`
   - `doc_tracker.md`
   
2. Load instruction file for current task:
   - Find task specified in `.memorybankrules` or `activeContext.md`
   - Read corresponding `{task_name}_instructions.txt`
   - Focus on "Steps" section for execution

3. Load all dependency files listed in the instruction file

## Step-by-Step Execution Process
1. **For each step in the instruction file:**
   - Understand the action required
   - Load any files that will be modified
   - Perform pre-action verification (see below)
   - Execute the action
   - Document results with Mini-CoT reasoning
   - Apply MUP after each step

2. **Pre-Action Verification (CRITICAL):**
   - Compare current file state with expected state
   - Document verification with format:
     ```
     ## Pre-Action Verification
     - Intended change: [describe change]
     - Expected current state: [what you expect]
     - Actual current state: [what you found]
     - Validation: [match/mismatch]
     ```
   - Proceed ONLY if states match, otherwise re-evaluate

3. **Error Handling Protocol:**
   - Document error conditions encountered
   - Analyze root cause using recent actions and state
   - Propose resolution options
   - Implementation corrections
   - Document the resolution process
   - Apply MUP after resolution

## Result Documentation (Mini-CoT)
After each step completion:
1. Summarize what was done
2. Explain key decisions made during execution
3. Document any unexpected challenges
4. Describe the outcome and its significance
5. Relate back to the overall objective

## Dependency Updating
When new dependencies are discovered during execution:
1. Update `dependency_tracker.md`:
   ```
   # Add new dependency
   # Format: ADD_DEP(source, target, type)
   ADD_DEP(module_a, module_c, REQ)
   ```
2. For module-level tasks, update mini-trackers:
   ```
   # Update mini tracker
   file_a = REQ:file_b,file_c,file_d
   ```

## Execution MUP
After each step execution:
1. Update instruction file with completion status:
   ```
   ## Steps
   1. ✅ Read data file
   2. ⬜ Process data
   ```
2. Update `activeContext.md` with:
   - Action taken
   - Results and observations
   - Any new knowledge gained
   - Next steps
   
3. Update `.memorybankrules`:
   ```
   [LAST_ACTION_STATE]
   last_action: "Completed Step 2 in DataProcessing_instructions.txt"
   current_phase: "Execution"
   next_action: "Execute Step 3"
   next_phase: "Execution"
   ```

4. For significant changes, update `changelog.md`:
   ```
   ## [YYYY-MM-DD]
   - Created data processing module
   - Connected to database interface
   - Modified logging system for compatibility
   ```

## Subtask Handling
When encountering a step that requires subtask execution:
1. Load subtask instruction file
2. Execute the subtask completely before continuing
3. Document subtask completion in parent task
4. Consolidate subtask outputs into parent context

## Exit Checklist
Before transitioning back to Strategy phase:
- All steps in instruction file(s) are executed
- All expected outputs are generated
- Results and observations are documented
- MUP is complete for all actions
- `.memorybankrules` is updated with next phase "Strategy"

## Process Flow
```
1. Load Context → 
2. For Each Step:
   a. Pre-Action Verification → 
   b. Execute Step → 
   c. Document Results (Mini-CoT) → 
   d. Apply MUP
3. Handle Errors (if any) → 
4. Process Subtasks (if any) → 
5. Consolidate Results → 
6. Exit Phase
```