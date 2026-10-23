// Sheet imports now run server-side every 15 minutes via sync-project-leads.
// Keep this component inert for compatibility with App.tsx; the retired August
// snapshot must never overwrite current contact data when an owner signs in.
const ProjectsDataSync = () => null;

export default ProjectsDataSync;
