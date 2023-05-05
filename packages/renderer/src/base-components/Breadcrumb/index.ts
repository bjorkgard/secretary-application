import Breadcrumb from './BreadcrumbComponent.vue';
import RouterLink from './RouterLink.vue';

const BreadcrumbComponent = Object.assign({}, Breadcrumb, {
  Link: RouterLink,
});

export default BreadcrumbComponent;
