/**
 * De voettekst: adres, openingstijden, contact, socials en keurmerken.
 */

import Link from 'next/link'

import { BEDRIJF, whatsappLink, routeLink } from '@/content/bedrijf'
import { WEEK, naarTijd, BUITEN_OPENINGSTIJDEN } from '@/content/openingstijden'
import { VOETMENU } from '@/content/navigatie'
import { OpeningsStatus } from '@/components/OpeningsStatus'

function Kolom({ titel, items }: { titel: string; items: { naam: string; pad: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 text-bijschrift font-semibold uppercase tracking-[0.14em] text-messing">{titel}</h2>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.pad}>
            <Link
              href={item.pad}
              className="text-basis text-tekst-licht-zacht no-underline transition-colors hover:text-ivoor"
            >
              {item.naam}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { adres, telefoon, whatsapp, email, socials, keurmerken } = BEDRIJF

  return (
    <footer className="border-t border-inkt-rand bg-inkt pb-28 pt-[var(--spacing-sectie)] md:pb-16">
      <div className="mx-auto max-w-[86rem] px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Adres en contact */}
          <div>
            <p className="font-kop text-kop-4 text-ivoor">{BEDRIJF.naam}</p>
            <p className="mt-1 text-basis italic text-messing">{BEDRIJF.slogan}</p>

            <address className="mt-6 not-italic text-basis text-tekst-licht-zacht">
              {adres.straat}
              <br />
              {adres.postcode} {adres.plaats}
              <br />
              <a
                href={routeLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-messing underline underline-offset-4"
              >
                Route plannen
              </a>
            </address>

            <ul className="mt-6 space-y-2.5 text-basis">
              <li>
                <a href={`tel:${telefoon.link}`} className="text-tekst-licht no-underline hover:text-messing">
                  {telefoon.weergave}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tekst-licht no-underline hover:text-messing"
                >
                  WhatsApp {whatsapp.weergave}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="break-all text-tekst-licht no-underline hover:text-messing">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <Kolom titel="Aanbod" items={VOETMENU.aanbod} />
          <Kolom titel="De winkel" items={VOETMENU.winkel} />

          {/* Openingstijden */}
          <div>
            <h2 className="mb-4 text-bijschrift font-semibold uppercase tracking-[0.14em] text-messing">
              Openingstijden
            </h2>
            <OpeningsStatus className="mb-4" />
            <table className="w-full max-w-[18rem] text-basis">
              <caption className="alleen-voor-schermlezers">Onze openingstijden per dag</caption>
              <tbody>
                {WEEK.map((dag) => {
                  const deel = dag.dagdelen[0]
                  return (
                    <tr key={dag.dag} className="align-baseline">
                      <th scope="row" className="py-1 pr-4 text-left font-normal text-tekst-licht-zacht">
                        {dag.naam}
                      </th>
                      <td className="py-1 tabular-nums text-tekst-licht">
                        {deel ? `${naarTijd(deel.van)} - ${naarTijd(deel.tot)}` : 'gesloten'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-4 max-w-[22rem] text-bijschrift leading-relaxed text-tekst-licht-zacht">
              {BUITEN_OPENINGSTIJDEN}
            </p>
          </div>
        </div>

        {/* Onderste rand */}
        <div className="mt-14 flex flex-col gap-8 border-t border-inkt-rand pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="text-bijschrift text-tekst-licht-zacht">Aangesloten bij</span>
            {keurmerken.map((k) => (
              <span
                key={k.naam}
                className="rounded-zacht border border-inkt-rand-sterk px-3 py-1.5 text-bijschrift font-semibold tracking-wider text-tekst-licht"
                title={k.omschrijving}
              >
                {k.naam}
                <span className="alleen-voor-schermlezers">: {k.omschrijving}</span>
              </span>
            ))}
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {Object.entries(socials).map(([naam, url]) => (
              <li key={naam}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bijschrift capitalize text-tekst-licht-zacht no-underline hover:text-messing"
                >
                  {naam}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-bijschrift text-tekst-licht-zacht lg:flex-row lg:items-center lg:justify-between">
          <p>
            &copy; {BEDRIJF.naam}
            {BEDRIJF.kvkNummer ? ` · KvK ${BEDRIJF.kvkNummer}` : ''}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {VOETMENU.regelen.map((item) => (
              <li key={item.pad}>
                <Link href={item.pad} className="text-tekst-licht-zacht no-underline hover:text-messing">
                  {item.naam}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
