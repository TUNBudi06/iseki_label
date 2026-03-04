import HomeController from './HomeController'
import AboutController from './AboutController'
import PrintHistoryController from './PrintHistoryController'
import PagePrintController from './PagePrintController'
import AutoPrintController from './AutoPrintController'
import AuthController from './AuthController'
import UserController from './UserController'
import RackPartListController from './RackPartListController'
import LoggerPerubahanController from './LoggerPerubahanController'
import RackController from './RackController'
const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
AboutController: Object.assign(AboutController, AboutController),
PrintHistoryController: Object.assign(PrintHistoryController, PrintHistoryController),
PagePrintController: Object.assign(PagePrintController, PagePrintController),
AutoPrintController: Object.assign(AutoPrintController, AutoPrintController),
AuthController: Object.assign(AuthController, AuthController),
UserController: Object.assign(UserController, UserController),
RackPartListController: Object.assign(RackPartListController, RackPartListController),
LoggerPerubahanController: Object.assign(LoggerPerubahanController, LoggerPerubahanController),
RackController: Object.assign(RackController, RackController),
}

export default Controllers