import printHistory from './print-history'
import queueLabelPrints from './queue-label-prints'
import autoPrint from './auto-print'
const api = {
    printHistory: Object.assign(printHistory, printHistory),
queueLabelPrints: Object.assign(queueLabelPrints, queueLabelPrints),
autoPrint: Object.assign(autoPrint, autoPrint),
}

export default api