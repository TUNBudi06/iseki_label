import PrintHistoryController from './PrintHistoryController'
import HomeController from './HomeController'
import AutoPrintController from './AutoPrintController'
import RackController from './RackController'
import AboutController from './AboutController'
import PagePrintController from './PagePrintController'
import AuthController from './AuthController'
import UserController from './UserController'
import RackPartListController from './RackPartListController'
import LoggerPerubahanController from './LoggerPerubahanController'
const Controllers = {
    PrintHistoryController: Object.assign(PrintHistoryController, PrintHistoryController),
HomeController: Object.assign(HomeController, HomeController),
AutoPrintController: Object.assign(AutoPrintController, AutoPrintController),
RackController: Object.assign(RackController, RackController),
AboutController: Object.assign(AboutController, AboutController),
PagePrintController: Object.assign(PagePrintController, PagePrintController),
AuthController: Object.assign(AuthController, AuthController),
UserController: Object.assign(UserController, UserController),
RackPartListController: Object.assign(RackPartListController, RackPartListController),
LoggerPerubahanController: Object.assign(LoggerPerubahanController, LoggerPerubahanController),
}

export default Controllers