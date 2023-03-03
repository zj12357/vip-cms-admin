//自定义面包屑导航
import { matchPath } from 'react-router-dom';
import { RouteIfoItemType } from '@/config/type';
import { PageBreadcrumbItem, PageFlatBreadcrumbItem } from './type';
const flatBeadcrumbTree = (routeList: RouteIfoItemType[]): any[] => {
    return routeList.reduce(
        (prev: RouteIfoItemType[], item: RouteIfoItemType) => {
            let { routes = [] } = item;
            let newItem: PageBreadcrumbItem = {
                path: item.path,
                breadcrumbName: item.name,
            };
            if (Array.isArray(routes) && routes.length) {
                return [...prev, newItem, ...flatBeadcrumbTree(routes)];
            } else {
                return [...prev, newItem];
            }
        },
        [],
    );
};

const flatBreadcrumbList = flatBeadcrumbTree([]) as PageFlatBreadcrumbItem[];

const getBreadcrumbs = (
    flattenRoutes: PageFlatBreadcrumbItem[],
    location: Location,
) => {
    let matches: PageFlatBreadcrumbItem[] = [];
    location.pathname

        .split('?')[0]
        .split('/')

        .reduce((prev, curSection) => {
            const pathSection = `${prev}/${curSection}`;

            const breadcrumb = getBreadcrumb(
                flattenRoutes,
                curSection,
                pathSection,
            );

            matches.push(breadcrumb);

            return pathSection;
        });
    return matches;
};

const getBreadcrumb = (
    flattenRoutes: PageFlatBreadcrumbItem[],
    curSection: string,
    pathSection: string,
) => {
    const matchRoute = flattenRoutes.find((ele) => {
        const { breadcrumbName, path } = ele;
        if (!breadcrumbName || !path) {
            throw new Error(
                'Router中的每一个route必须包含 `path` 以及 `breadcrumbName` 属性',
            );
        }
        return matchPath(pathSection, path);
    });

    if (matchRoute) {
        return {
            breadcrumbName: matchRoute.breadcrumbName || curSection,
            path: matchRoute.path,
        };
    }

    return {
        breadcrumbName: pathSection === '/' ? '首页' : curSection,
        path: pathSection,
    };
};
const breadcrumbList = getBreadcrumbs(flatBreadcrumbList, window.location);
export default { breadcrumbList };
