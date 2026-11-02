import { SetMetadata } from "@nestjs/common";
import { UserTye } from "../../utils/enum";


export const Roles = (...roles:UserTye[])=>SetMetadata("roles",roles)