import printHistory from './print-history'
import queueLabelPrints from './queue-label-prints'
import autoPrint from './auto-print'
import rack from './rack'
import importLabel from './import-label'
const api = {
    printHistory: Object.assign(printHistory, printHistory),
queueLabelPrints: Object.assign(queueLabelPrints, queueLabelPrints),
autoPrint: Object.assign(autoPrint, autoPrint),
rack: Object.assign(rack, rack),
importLabel: Object.assign(importLabel, importLabel),
}

export default api