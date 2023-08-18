import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create:[roles.User],
    cancel:[roles.User],
    updateOrderStatusByAdmin:[roles.Admin]
}