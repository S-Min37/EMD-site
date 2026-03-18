export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Research Page')
        .id('researchPage')
        .child(S.document().schemaType('researchPage').documentId('researchPage')),
      S.divider(),
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.documentTypeList('page')
            .title('Pages')
            .filter('_type == "page" && route != "alumni"')
        ),
      S.listItem()
        .title('Alumni')
        .id('alumni')
        .child(S.document().schemaType('page').documentId('page.alumni')),
      S.documentTypeListItem('people').title('People'),
      S.documentTypeListItem('news').title('News'),
      S.documentTypeListItem('publication').title('Legacy Publications'),
      S.documentTypeListItem('project').title('Legacy Projects'),
    ])
