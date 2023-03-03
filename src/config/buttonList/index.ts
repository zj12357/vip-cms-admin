/**
 * @Description: 标识格式：路由+类型名称+操作 ;
 * @Params:  ;
 * @Return:  ;
 */
import { accountButton } from './account';
import { systemButton } from './system';
import { admissionButton } from './admission';
import { silverHeadButton } from './silverHead';

export const buttonNormalList = [
    ...accountButton,
    ...systemButton,
    ...admissionButton,
    ...silverHeadButton,
];
