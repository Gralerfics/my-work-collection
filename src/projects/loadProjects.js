import { projectConfig } from '../content/projectConfig'

const metaModules = import.meta.glob('./*/meta.{json,js}', {
  eager: true,
  import: 'default',
})

const pageModules = import.meta.glob('./*/Page.vue', {
  eager: true,
  import: 'default',
})

const assetModules = import.meta.glob('./*/assets/*', {
  eager: true,
  import: 'default',
})

const projectEntries = Object.entries(metaModules).map(([path, meta]) => {
  const slug = path.split('/')[1]
  const explicitCover = meta.cover ? assetModules[`./${slug}/${meta.cover}`] : null
  const groups = Array.isArray(meta.groups)
    ? meta.groups
    : meta.group
      ? [meta.group]
      : []
  const repositoryLinks = Array.isArray(meta.repos)
    ? meta.repos.map((repository) => ({
        label: {
          en: 'Repository',
          zh: '查看仓库',
        },
        ...repository,
      }))
    : meta.repo
      ? [{
          label: {
            en: 'Repository',
            zh: '查看仓库',
          },
          href: meta.repo,
        }]
      : []

  return {
    slug,
    ...meta,
    groups,
    repositoryLinks,
    cover: explicitCover ?? null,
    pageComponent: pageModules[`./${slug}/Page.vue`],
  }
})

export const projects = projectEntries.sort((left, right) => {
  const leftPriority = left.priority ?? 0
  const rightPriority = right.priority ?? 0

  if (leftPriority !== rightPriority) {
    return rightPriority - leftPriority
  }

  return left.title.localeCompare(right.title)
})

export const projectTabs = Array.from(new Set(projects.flatMap((project) => project.groups))).sort(
  (left, right) => {
    const leftPriority = projectConfig.groupPriority[left] ?? 0
    const rightPriority = projectConfig.groupPriority[right] ?? 0

    if (leftPriority !== rightPriority) {
      return rightPriority - leftPriority
    }

    return left.localeCompare(right)
  },
)
