import { config, collection, singleton, fields } from '@keystatic/core'

/**
 * Het beheerscherm van de site, te bereiken op /keystatic.
 *
 * Hier kunnen Gerard en Gerda zelf dingen aanpassen zonder ook maar iets met
 * code te maken te hebben: nieuwsberichten, een mededeling bovenaan de site,
 * afwijkende openingstijden, de merken en de teksten over henzelf.
 *
 * Alles wat ze opslaan wordt een gewone wijziging in de repo. Daardoor is
 * altijd terug te zien wat er wanneer veranderd is, en kan er nooit iets
 * kwijtraken.
 *
 * Twee manieren van werken:
 *   - Op een eigen computer (`npm run dev`): opslaan schrijft rechtstreeks in
 *     de bestanden op die computer.
 *   - Op de live site: opslaan gaat via GitHub. Daarvoor moet eenmalig een
 *     GitHub-app gekoppeld worden; zie docs/handleiding-beheer.md.
 */

const opslag = process.env.KEYSTATIC_GITHUB_REPO
  ? ({
      kind: 'github' as const,
      repo: process.env.KEYSTATIC_GITHUB_REPO as `${string}/${string}`,
    })
  : ({ kind: 'local' as const })

export default config({
  storage: opslag,

  ui: {
    brand: { name: 'Oogcontact bij Gerard' },
    navigation: {
      'Op de site': ['mededeling', 'nieuws'],
      'De winkel': ['uitzonderingen', 'merken', 'overOns'],
      Instagram: ['instagram'],
    },
  },

  singletons: {
    /* ------------------------------------------------------------------ */
    mededeling: singleton({
      label: 'Mededeling bovenaan',
      path: 'src/content/beheer/mededeling',
      format: { data: 'json' },
      schema: {
        actief: fields.checkbox({
          label: 'Mededeling tonen',
          description:
            'Zet dit aan om de balk bovenaan de site te tonen. Staat er een begin- en einddatum ' +
            'bij, dan verschijnt en verdwijnt de balk vanzelf op die dagen.',
          defaultValue: false,
        }),
        tekst: fields.text({
          label: 'De tekst',
          description:
            'Bijvoorbeeld: Wij zijn met vakantie van 6 tot en met 16 juli. Houd het kort, ' +
            'het is één regel.',
          multiline: true,
          validation: { length: { max: 200 } },
        }),
        vanaf: fields.date({
          label: 'Tonen vanaf',
          description: 'Laat leeg om meteen te tonen.',
        }),
        totEnMet: fields.date({
          label: 'Tonen tot en met',
          description:
            'De laatste dag dat de mededeling te zien is. Laat leeg om hem te blijven tonen ' +
            'zolang hij aanstaat.',
        }),
        link: fields.text({
          label: 'Link (niet verplicht)',
          description: 'Bijvoorbeeld /nieuws/ als er een uitgebreider bericht bij hoort.',
        }),
      },
    }),

    /* ------------------------------------------------------------------ */
    uitzonderingen: singleton({
      label: 'Afwijkende openingstijden',
      path: 'src/content/beheer/uitzonderingen',
      format: { data: 'json' },
      schema: {
        dagen: fields.array(
          fields.object({
            datum: fields.date({
              label: 'Welke dag',
              validation: { isRequired: true },
            }),
            gesloten: fields.checkbox({
              label: 'Die dag helemaal gesloten',
              defaultValue: true,
            }),
            van: fields.text({
              label: 'Open vanaf',
              description: 'Alleen invullen als je die dag wél open bent. Schrijf het als 9:30.',
            }),
            tot: fields.text({
              label: 'Open tot',
              description: 'Alleen invullen als je die dag wél open bent. Schrijf het als 13:00.',
            }),
            reden: fields.text({
              label: 'Reden',
              description: 'Bijvoorbeeld: Eerste kerstdag, of Vakantie. Dit zien bezoekers ook.',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Afwijkende dagen',
            description:
              'Feestdagen, vakantie of een dag dat je eerder dichtgaat. De site rekent hier ' +
              'zelf mee: "Nu geopend" en "wij zijn weer open op ..." kloppen dan meteen.',
            itemLabel: (item) => `${item.fields.datum.value ?? 'nog geen datum'} - ${item.fields.reden.value}`,
          },
        ),
      },
    }),

    /* ------------------------------------------------------------------ */
    overOns: singleton({
      label: 'Over ons',
      path: 'src/content/beheer/over-ons',
      format: { data: 'json' },
      schema: {
        gerard: fields.object({
          naam: fields.text({ label: 'Naam', defaultValue: 'Gerard' }),
          rol: fields.text({ label: 'Wat doet hij in de winkel' }),
          verhaal: fields.text({ label: 'Zijn verhaal', multiline: true }),
        }, { label: 'Gerard' }),
        gerda: fields.object({
          naam: fields.text({ label: 'Naam', defaultValue: 'Gerda' }),
          rol: fields.text({ label: 'Wat doet zij in de winkel' }),
          verhaal: fields.text({ label: 'Haar verhaal', multiline: true }),
        }, { label: 'Gerda' }),
      },
    }),
  },

  collections: {
    /* ------------------------------------------------------------------ */
    nieuws: collection({
      label: 'Nieuwsberichten',
      slugField: 'titel',
      path: 'src/content/beheer/nieuws/*',
      format: { contentField: 'inhoud' },
      columns: ['titel', 'datum'],
      entryLayout: 'content',
      schema: {
        titel: fields.slug({
          name: {
            label: 'Titel',
            description: 'Waar gaat het bericht over? Houd het kort en duidelijk.',
            validation: { isRequired: true },
          },
          slug: {
            label: 'Webadres',
            description:
              'Dit komt achter /nieuws/ in de adresbalk. Laat het staan zoals het is, ' +
              'tenzij je een goede reden hebt om het aan te passen.',
          },
        }),
        datum: fields.date({
          label: 'Datum',
          description: 'De datum die bij het bericht staat.',
          validation: { isRequired: true },
        }),
        samenvatting: fields.text({
          label: 'Korte samenvatting',
          description:
            'Eén of twee zinnen. Dit staat in het overzicht en in Google. ' +
            'Spreek de lezer aan met "je".',
          multiline: true,
          validation: { isRequired: true, length: { max: 300 } },
        }),
        gepubliceerd: fields.checkbox({
          label: 'Zichtbaar op de site',
          description: 'Zet dit uit als je nog aan het bericht werkt.',
          defaultValue: true,
        }),
        inhoud: fields.markdoc({
          label: 'Het bericht',
          options: {
            image: {
              directory: 'public/beeld/nieuws',
              publicPath: '/beeld/nieuws/',
            },
          },
        }),
      },
    }),

    /* ------------------------------------------------------------------ */
    instagram: collection({
      label: 'Instagram-berichten',
      slugField: 'omschrijving',
      path: 'src/content/beheer/instagram/*',
      format: { data: 'json' },
      columns: ['omschrijving'],
      schema: {
        omschrijving: fields.slug({
          name: {
            label: 'Waar staat op de foto?',
            description:
              'Beschrijf kort wat er te zien is. Deze tekst is voor mensen die de foto niet ' +
              'kunnen zien, dus beschrijf wat er écht op staat.',
            validation: { isRequired: true },
          },
        }),
        afbeelding: fields.image({
          label: 'De foto',
          directory: 'public/beeld/instagram',
          publicPath: '/beeld/instagram/',
          validation: { isRequired: true },
        }),
        link: fields.url({
          label: 'Link naar het bericht op Instagram',
          description: 'Plak hier het adres van het bericht. Niet verplicht.',
        }),
        volgorde: fields.integer({
          label: 'Volgorde',
          description: 'Lager getal staat vooraan. Laat maar staan als je het niet erg vindt.',
          defaultValue: 0,
        }),
      },
    }),

    /* ------------------------------------------------------------------ */
    merken: collection({
      label: 'Merken in de collectie',
      slugField: 'naam',
      path: 'src/content/beheer/merken/*',
      format: { data: 'json' },
      columns: ['naam', 'herkomst'],
      schema: {
        naam: fields.slug({ name: { label: 'Merknaam', validation: { isRequired: true } } }),
        herkomst: fields.text({
          label: 'Land van herkomst',
          description: 'Bijvoorbeeld Italië, Spanje of Zwitserland. Laat leeg als je het niet zeker weet.',
        }),
        toelichting: fields.text({
          label: 'Korte toelichting',
          description: 'Eén of twee zinnen over wat dit merk bijzonder maakt. Niet verplicht.',
          multiline: true,
          validation: { length: { max: 240 } },
        }),
        soorten: fields.multiselect({
          label: 'Waarvoor',
          options: [
            { label: 'Monturen', value: 'monturen' },
            { label: 'Zonnebrillen', value: 'zonnebrillen' },
            { label: 'Sportbrillen', value: 'sport' },
            { label: 'Glazen', value: 'glazen' },
            { label: 'Loepbrillen', value: 'loepbrillen' },
          ],
          defaultValue: ['monturen'],
        }),
        zichtbaar: fields.checkbox({ label: 'Op de site tonen', defaultValue: true }),
      },
    }),
  },
})
