// Normally you'd want to put these exports in the files that register them, but if you do that you'll get an import order error if you import them in certain cases.
// (importing them runs the whole file to get the ID, causing an import error). I guess it's best practice to separate out IDs, pretty annoying...

export const SYFER_CTRL_L_ACTION_ID = 'syfer.ctrlLAction'

export const SYFER_CTRL_K_ACTION_ID = 'syfer.ctrlKAction'

export const SYFER_ACCEPT_DIFF_ACTION_ID = 'syfer.acceptDiff'

export const SYFER_REJECT_DIFF_ACTION_ID = 'syfer.rejectDiff'

export const SYFER_GOTO_NEXT_DIFF_ACTION_ID = 'syfer.goToNextDiff'

export const SYFER_GOTO_PREV_DIFF_ACTION_ID = 'syfer.goToPrevDiff'

export const SYFER_GOTO_NEXT_URI_ACTION_ID = 'syfer.goToNextUri'

export const SYFER_GOTO_PREV_URI_ACTION_ID = 'syfer.goToPrevUri'

export const SYFER_ACCEPT_FILE_ACTION_ID = 'syfer.acceptFile'

export const SYFER_REJECT_FILE_ACTION_ID = 'syfer.rejectFile'

export const SYFER_ACCEPT_ALL_DIFFS_ACTION_ID = 'syfer.acceptAllDiffs'

export const SYFER_REJECT_ALL_DIFFS_ACTION_ID = 'syfer.rejectAllDiffs'
