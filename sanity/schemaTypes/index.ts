import {peopleType} from './people'
import {publicationType} from './publication'
import {projectType} from './project'
import {newsType} from './news'
import {siteSettingsType} from './siteSettings'
import {homePageType} from './homePage'
import {researchPageType} from './researchPage'
import {pageType} from './page'

export const schemaTypes = [
  siteSettingsType,
  homePageType,
  researchPageType,
  pageType,
  peopleType,
  publicationType,
  projectType,
  newsType,
]
