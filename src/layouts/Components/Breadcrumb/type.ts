export interface PageBreadcrumbItem {
    path: string;
    breadcrumbName: string;
    children?: PageBreadcrumbItem[];
}

export interface PageFlatBreadcrumbItem {
    path: string;
    breadcrumbName: string;
}
