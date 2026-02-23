import PrintHistoryController from './PrintHistoryController'
import HomeController from './HomeController'
import AutoPrintController from './AutoPrintController'
import AboutController from './AboutController'
import PagePrintController from './PagePrintController'
import AuthController from './AuthController'
import UserController from './UserController'
const Controllers = {
    PrintHistoryController: Object.assign(PrintHistoryController, PrintHistoryController),
HomeController: Object.assign(HomeController, HomeController),
AutoPrintController: Object.assign(AutoPrintController, AutoPrintController),
AboutController: Object.assign(AboutController, AboutController),
PagePrintController: Object.assign(PagePrintController, PagePrintController),
AuthController: Object.assign(AuthController, AuthController),
UserController: Object.assign(UserController, UserController),
}

export default Controllers