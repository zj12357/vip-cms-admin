import { nanoid } from 'nanoid';
import _ from 'lodash';

//处理菜单绑定权限
export const transTableData = (
    list: Record<string, any>[],
    field: string,
    transField: string,
    idField?: string,
) => {
    return list.reduce((res: any[], next: Record<string, any>) => {
        const haveChildren =
            Array.isArray(next[field]) && next[field].length > 0;
        let newItem: Record<string, any> = {
            ...next,
            id: next[idField ?? ''] ?? nanoid(),
            //禁用父节点
            disabled: next[field]?.length === 0 || !next[field],
            children: haveChildren
                ? next[field].map((item: any) => {
                      return {
                          ...item,
                          department_name: item[transField],
                      };
                  })
                : [],
        };

        res = res.concat(newItem);

        return res;
    }, []);
};

//处理职务，职级
export const transPosition = (list: any[], transField: string) => {
    return _.flattenDeep(
        list.map((item) => {
            return _.flattenDeep(item.r).map((v: any) => {
                return {
                    label: v[transField],
                    value: v.id,
                };
            });
        }),
    );
};
