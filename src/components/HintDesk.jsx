import { useState } from "react";
import hintImage1 from "../../afb_bij_hint1.png";
import hintImage2 from "../../afb_bij_hint2.png";

const HINTS = [
  {
    id: "hint-1",
    title: "Uitleg lineaire hypotheek",
    image: hintImage1,
    imageAlt: "Grafiek bij hint 1",
    blocks: [
      { type: "p", content: "Bij een lineaire hypotheek los je elke maand hetzelfde bedrag af, oftewel:" },
      { type: "formula", formula: "linearPayment" },
      {
        type: "p",
        content:
          "Daarbovenop betaal je elke maand de rente over de nog openstaande schuld. Omdat de openstaande schuld elke maand lineair daalt, daalt de rente die er betaald moet worden ook elke maand lineair, en daarmee ook het totaalbedrag.",
      },
      { type: "p", content: "Hier hoort de volgende grafiek bij:" },
      { type: "image" },
    ],
  },
  {
    id: "hint-2",
    title: "Uitleg annuitaire hypotheek",
    image: hintImage2,
    imageAlt: "Grafiek bij hint 2",
    blocks: [
      {
        type: "p",
        content:
          "Bij een annuitaire hypotheek betaal je elke maand hetzelfde bedrag. Je betaalt wel nog steeds elke maand de rente over de hele openstaande schuld.",
      },
      {
        type: "p",
        content:
          "Omdat de schuld in het begin nog hoger is dan op het eind, betekent dit dat er in het begin minder afgelost wordt en meer naar rente gaat, en op het einde meer wordt afgelost en minder naar rente gaat.",
      },
      { type: "p", content: "Hier hoort de volgende grafiek bij:" },
      { type: "image" },
    ],
  },
  {
    id: "hint-3",
    title: "Rente berekeningen",
    blocks: [
      {
        type: "p",
        content:
          "De hoeveelheid rente die je moet betalen wordt berekend aan de hand van een jaarlijks percentage, in ons geval 2%. Het rente bedrag is dan dus elk jaar (ongeveer):",
      },
      { type: "formula", formula: "yearlyInterestDebtBlock" },
      {
        type: "p",
        content:
          "Er wordt maandelijks afgelost, dus wordt ook maandelijks de rente berekend. Hiervoor delen economen het percentage meestal simpelweg door 12.",
      },
      {
        type: "p",
        content: [
          "Om alleen de (jaarlijkse) rente te berekenen vermenigvuldigen we dus met ",
          { type: "math", name: "rateDecimal" },
          ", maar als we de (jaarlijkse) rente meteen willen optellen bij de schuld, kunnen we ook vermenigvuldigen met ",
          { type: "math", name: "growthDecimal" },
          ". Dit getal heet de groeifactor ",
          { type: "math", name: "g" },
          ". De wiskundig juiste manier om de maandelijkse groeifactor te vinden is met de formule:",
        ],
      },
      { type: "formula", formula: "monthlyGrowth" },
      {
        type: "p",
        content:
          "Als we willen bepalen hoeveel de schuld groeit over meerdere maanden (zonder afbetalingen), moeten we herhaaldelijk met g vermenigvuldigen, dus voor 8 maanden:",
      },
      { type: "formula", formula: "eightMonths" },
      {
        type: "p",
        content:
          [
            "Ten slotte, als we het totale bedrag (met rente) al weten, kunnen we de schuld terugvinden door juist te delen door ",
            { type: "math", name: "g" },
            ".",
          ],
      },
    ],
  },
  {
    id: "hint-4",
    title: "Berekeningen lineaire hypotheek",
    blocks: [
      {
        type: "p",
        content:
          "De maandelijkse aflossing is altijd hetzelfde en kan dus berekend worden met de formule:",
      },
      { type: "formula", formula: "linearPaymentShort" },
      {
        type: "p",
        content:
          "Omdat de aflossing elke maand hetzelfde is, is het makkelijk om gedurende de hele looptijd te bepalen wat de resterende schuld is:",
      },
      { type: "formula", formula: "remainingDebtLinear" },
      {
        type: "p",
        content:
          "De rente die er dan in de volgende maand betaald moet worden, kun je dan berekenen over de resterende schuld.",
      },
    ],
  },
  {
    id: "hint-5",
    title: "Berekeningen annuitaire hypotheek",
    blocks: [
      {
        type: "p",
        content:
          "De maandelijkse totale kosten van een annuitaire hypotheek worden met een standaard formule berekend, en zijn afhankelijk van het rentepercentage, de looptijd, en natuurlijk het totaalbedrag van de hypotheek. Als je de restschuld in een bepaalde maand weet, dan kun je bepalen hoe het maandelijkse bedrag wordt opgesplitst in aflossing en rentedeel, door de rente te berekenen over de huidige restschuld.",
      },
      {
        type: "p",
        content:
          "Bij de annuitaire is het lastig om tijdens de looptijd bij te houden hoeveel schuld er nog over is, omdat de maandelijkse aflossing elke maand stijgt. Aan het begin weet je dit natuurlijk wel, dus vanaf hier zou je kunnen doorrekenen.",
      },
      {
        type: "p",
        content:
          "Ook aan het einde kun je de aflossingsdeel berekenen, omdat je elke maand hetzelfde betaalt en dus al weet hoeveel je in de laatste maand in totaal moet betalen. Vanuit daar kun je terugrekenen welk deel daarvan de laatste aflossing is.",
      },
    ],
  },
  {
    id: "hint-6",
    title: "De rekenkundige reeks",
    blocks: [
      {
        type: "p",
        content:
          "De rekenkundige reeks is de som van een rij getallen, waarvan opeenvolgende getallen steeds evenveel van elkaar verschillen. Bijvoorbeeld:",
      },
      { type: "p", content: "2, 5, 8, 13, 16, 19, 22." },
      {
        type: "p",
        content:
          "Als je van zo'n rij getallen eerst de eerste en de laatste, dan de tweede en de een-na-laatste enzovoort, bij elkaar optelt, krijg je telkens hetzelfde getal. In ons voorbeeld is dat: 2 + 22 = 24, 5 + 19 = 24, enzovoort.",
      },
      {
        type: "p",
        content: [
          "Dit kun je ",
          { type: "math", name: "nOverTwo" },
          " keer doen (waarbij n het aantal getallen in de rij is), voordat je alle getallen hebt gebruikt. De som van zo'n rij getallen is dus",
        ],
      },
      { type: "formula", formula: "arithmeticSum" },
      {
        type: "p",
        content: [
          "waarbij ",
          { type: "math", name: "t1" },
          " het eerste en ",
          { type: "math", name: "tn" },
          " het laatste getal van de rij zijn.",
        ],
      },
      {
        type: "p",
        content:
          "Bij een lineaire aflossing zakt het bedrag dat je elke maand moet betalen telkens evenveel, dus de bedragen vormen een rekenkundige reeks.",
      },
    ],
  },
  {
    id: "hint-7",
    title: "De meetkundige reeks",
    blocks: [
      {
        type: "p",
        content:
          "Bij een meetkundige reeks nemen we de som van een rij van n getallen, beginnend bij een getal a, die we elke keer opnieuw met een getal r vermenigvuldigen:",
      },
      { type: "formula", formula: "geometricTerms" },
      {
        type: "p",
        content:
          "Deze reeks komt vaak voor in economische contexten waarbij elke maand hetzelfde wordt betaald/ingelegd en er elke maand rente wordt berekend (r is dus de groeifactor op basis van de rente). Zoals bij een annuitaire hypotheek! De uitkomst van deze som is",
      },
      { type: "formula", formula: "geometricSum" },
      {
        type: "p",
        content:
          "Met deze reeks kun je nagaan of je maandelijkse annuiteït genoeg is om de hypotheek af te betalen. Ervan uitgaande dat je met je laatste betaling, ter hoogte van de annuiteït A, precies je hypotheek afbetaald, los je in de laatste maand een bedrag af van:",
      },
      { type: "formula", formula: "lastPayment" },
      {
        type: "p",
        content:
          "Vanuit hier zouden we kunnen terugrekenen en zien dat je in de een na laatste maand dit bedrag afbetaald:",
      },
      { type: "formula", formula: "ArMinus2Block" },
      { type: "p", content: "de maand daarvoor:" },
      { type: "formula", formula: "ArMinus3Block" },
      { type: "p", content: "enzovoort." },
      {
        type: "p",
        content:
          "We kunnen nu a zo kiezen dat de laatste term in de meetkundige reeks gelijk is aan:",
      },
      { type: "formula", formula: "lastGeometricTerm" },
      { type: "p", content: "de een-na-laatste gelijk aan:" },
      { type: "formula", formula: "penultimateGeometricTerm" },
      { type: "p", content: "enzovoort." },
      {
        type: "p",
        content:
          "Als de som dan uitkomt op een getal dat minstens zo groot is als de totale hypotheek, dan weten we dat de maandelijkse annuiteït groot genoeg was.",
      },
    ],
  },
  {
    id: "hint-8",
    title: "Extra hint meetkundige rij",
    blocks: [
      {
        type: "p",
        content: [
          { type: "strong", content: "Mogelijke extra hint als het toch niet lukt:" },
          { type: "br" },
          "Kies:",
        ],
      },
      { type: "formula", formula: "aArNBlock" },
      {
        type: "p",
        content: "en check voor jezelf dat dan inderdaad:",
      },
      { type: "formula", formula: "checkArN" },
      {
        type: "p",
        content: [
          "dit patroon kan je doorzetten naar aflossing in twee na laatste maand is:",
        ],
      },
      { type: "formula", formula: "ArMinus3Block" },
      { type: "p", content: "enzovoort" },
    ],
  },
];

function InlineMath({ name }) {
  if (name === "nOverTwo") {
    return (
      <math className="inline-math">
        <mfrac>
          <mi>n</mi>
          <mn>2</mn>
        </mfrac>
      </math>
    );
  }

  if (name === "t1") {
    return (
      <math className="inline-math">
        <msub>
          <mi>t</mi>
          <mn>1</mn>
        </msub>
      </math>
    );
  }

  if (name === "tn") {
    return (
      <math className="inline-math">
        <msub>
          <mi>t</mi>
          <mi>n</mi>
        </msub>
      </math>
    );
  }

  if (name === "ArMinus1" || name === "ArMinus2" || name === "ArMinus3") {
    const exponent = name === "ArMinus1" ? 1 : name === "ArMinus2" ? 2 : 3;
    return (
      <math className="inline-math">
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>{exponent}</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "aRnMinus1" || name === "aRnMinus2") {
    const offset = name === "aRnMinus1" ? 1 : 2;
    return (
      <math className="inline-math">
        <mi>a</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mi>n</mi>
            <mo>-</mo>
            <mn>{offset}</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "aArN") {
    return (
      <math className="inline-math">
        <mi>a</mi>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mi>n</mi>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "yearlyInterestDebt") {
    return (
      <math className="inline-math">
        <mn>0.02</mn>
        <mo>&#x22C5;</mo>
        <mtext>huidige schuld</mtext>
      </math>
    );
  }

  if (name === "rateDecimal") {
    return (
      <math className="inline-math">
        <mn>0,02</mn>
      </math>
    );
  }

  if (name === "growthDecimal") {
    return (
      <math className="inline-math">
        <mn>1,02</mn>
      </math>
    );
  }

  if (name === "g") {
    return (
      <math className="inline-math">
        <mi>g</mi>
      </math>
    );
  }

  return null;
}

function Formula({ name }) {
  if (name === "linearPayment" || name === "linearPaymentShort") {
    return (
      <math className="latex-formula" display="block">
        <mfrac>
          <mtext>{name === "linearPayment" ? "hypotheekbedrag" : "totale hypotheek"}</mtext>
          <mtext>looptijd in maanden</mtext>
        </mfrac>
      </math>
    );
  }

  if (name === "remainingDebtLinear") {
    return (
      <math className="latex-formula text-formula" display="block">
        <mtext>totale hypotheek</mtext>
        <mo>-</mo>
        <mtext>verstreken maanden</mtext>
        <mo>&#x22C5;</mo>
        <mtext>maandelijkse aflossing</mtext>
      </math>
    );
  }

  if (name === "monthlyGrowth") {
    return (
      <math className="latex-formula" display="block">
        <msup>
          <mi>g</mi>
          <mfrac>
            <mn>1</mn>
            <mn>12</mn>
          </mfrac>
        </msup>
      </math>
    );
  }

  if (name === "eightMonths") {
    return (
      <math className="latex-formula" display="block">
        <mtext>schuld</mtext>
        <mo>&#x22C5;</mo>
        <msup>
          <mi>g</mi>
          <mn>8</mn>
        </msup>
      </math>
    );
  }

  if (name === "yearlyInterestDebtBlock") {
    return (
      <math className="latex-formula" display="block">
        <mn>0.02</mn>
        <mo>&#x22C5;</mo>
        <mtext>huidige schuld</mtext>
      </math>
    );
  }

  if (name === "arithmeticSum") {
    return (
      <math className="latex-formula arithmetic-formula" display="block">
        <msub>
          <mi>S</mi>
          <mi>n</mi>
        </msub>
        <mo>=</mo>
        <mfrac>
          <mn>1</mn>
          <mn>2</mn>
        </mfrac>
        <mi>n</mi>
        <mo stretchy="false">(</mo>
        <msub>
          <mi>t</mi>
          <mn>1</mn>
        </msub>
        <mo>+</mo>
        <msub>
          <mi>t</mi>
          <mi>n</mi>
        </msub>
        <mo stretchy="false">)</mo>
      </math>
    );
  }

  if (name === "geometricTerms") {
    return (
      <math className="latex-formula" display="block">
        <mi>a</mi>
        <mo>+</mo>
        <mi>a</mi>
        <mi>r</mi>
        <mo>+</mo>
        <mi>a</mi>
        <msup>
          <mi>r</mi>
          <mn>2</mn>
        </msup>
        <mo>+</mo>
        <mi>a</mi>
        <msup>
          <mi>r</mi>
          <mn>3</mn>
        </msup>
        <mo>+</mo>
        <mo>&#x2026;</mo>
        <mo>+</mo>
        <mi>a</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mi>n</mi>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "geometricSum") {
    return (
      <div className="formula-scroll">
        <math className="latex-formula geometric-formula" display="block">
          <mrow>
            <munderover>
              <mo>&#x2211;</mo>
              <mrow>
                <mi>k</mi>
                <mo>=</mo>
                <mn>0</mn>
              </mrow>
              <mrow>
                <mi>n</mi>
                <mo>-</mo>
                <mn>1</mn>
              </mrow>
            </munderover>
            <mi>a</mi>
            <msup>
              <mi>r</mi>
              <mi>k</mi>
            </msup>
            <mo>=</mo>
            <mi>a</mi>
            <mo>+</mo>
            <mi>a</mi>
            <mi>r</mi>
            <mo>+</mo>
            <mi>a</mi>
            <msup>
              <mi>r</mi>
              <mn>2</mn>
            </msup>
            <mo>+</mo>
            <mo>&#x2026;</mo>
            <mo>+</mo>
            <mi>a</mi>
            <msup>
              <mi>r</mi>
              <mrow>
                <mi>n</mi>
                <mo>-</mo>
                <mn>1</mn>
              </mrow>
            </msup>
            <mo>=</mo>
            <mi>a</mi>
            <mo>&#x22C5;</mo>
            <mfrac>
              <mrow>
                <mn>1</mn>
                <mo>-</mo>
                <msup>
                  <mi>r</mi>
                  <mi>n</mi>
                </msup>
              </mrow>
              <mrow>
                <mn>1</mn>
                <mo>-</mo>
                <mi>r</mi>
              </mrow>
            </mfrac>
          </mrow>
        </math>
        <div className="math-fallback" aria-hidden="true">
          ∑(k=0 tot n-1) ar^k = a + ar + ar^2 + ... + ar^(n-1) = a · (1 - r^n) / (1 - r)
        </div>
      </div>
    );
  }

  if (name === "lastPayment") {
    return (
      <math className="latex-formula compact-display-formula" display="block">
        <mfrac>
          <mi>A</mi>
          <mi>r</mi>
        </mfrac>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "ArMinus2Block" || name === "ArMinus3Block") {
    const exponent = name === "ArMinus2Block" ? 2 : 3;
    return (
      <math className="latex-formula compact-display-formula" display="block">
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>{exponent}</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "lastGeometricTerm" || name === "penultimateGeometricTerm") {
    const offset = name === "lastGeometricTerm" ? 1 : 2;
    return (
      <math className="latex-formula compact-display-formula" display="block">
        <mi>a</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mi>n</mi>
            <mo>-</mo>
            <mn>{offset}</mn>
          </mrow>
        </msup>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>{offset}</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "aArNBlock") {
    return (
      <math className="latex-formula compact-display-formula" display="block">
        <mi>a</mi>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mi>n</mi>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "checkArN") {
    return (
      <math className="latex-formula compact-display-formula" display="block">
        <mi>a</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mi>n</mi>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "annuityLastMonth") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mtext>Annuiteit</mtext>
        <mo>=</mo>
        <mi>A</mi>
        <mo>=</mo>
        <mtext>aflossing</mtext>
        <mo>&#x22C5;</mo>
        <mi>r</mi>
      </math>
    );
  }

  if (name === "lastMonthDebt") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mtext>restschuld en tevens aflossing</mtext>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "annuityLabel") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mtext>Annuiteit</mtext>
        <mo>=</mo>
      </math>
    );
  }

  if (name === "annuityDerivation1") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mi>A</mi>
        <mo>=</mo>
        <mtext>rentedeel</mtext>
        <mo>+</mo>
        <mtext>aflossing</mtext>
        <mo>=</mo>
        <mtext>restschuld</mtext>
        <mo>&#x22C5;</mo>
        <mo stretchy="false">(</mo>
        <mi>r</mi>
        <mo>-</mo>
        <mn>1</mn>
        <mo stretchy="false">)</mo>
        <mo>+</mo>
        <mtext>aflossing</mtext>
      </math>
    );
  }

  if (name === "annuityDerivation2") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mo>=</mo>
        <mi>A</mi>
        <mo>-</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo>+</mo>
        <mtext>aflossing</mtext>
        <mo>&#x22C5;</mo>
        <mi>r</mi>
      </math>
    );
  }

  if (name === "annuityDerivation3") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mo>=</mo>
        <mi>A</mi>
        <mo>+</mo>
        <mtext>aflossing</mtext>
        <mo>&#x22C5;</mo>
        <mi>r</mi>
        <mo>-</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "annuityDerivation4") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mtext>dus aflossing</mtext>
        <mo>&#x22C5;</mo>
        <mi>r</mi>
        <mo>-</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo>=</mo>
        <mn>0</mn>
      </math>
    );
  }

  if (name === "annuityDerivation5") {
    return (
      <math className="latex-formula derivation-formula" display="block">
        <mtext>dus aflossing</mtext>
        <mo>&#x22C5;</mo>
        <mi>r</mi>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>1</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  if (name === "annuityDerivation6") {
    return (
      <math className="latex-formula derivation-formula final-derivation" display="block">
        <mtext>dus aflossing</mtext>
        <mo>=</mo>
        <mi>A</mi>
        <msup>
          <mi>r</mi>
          <mrow>
            <mo>-</mo>
            <mn>2</mn>
          </mrow>
        </msup>
      </math>
    );
  }

  return null;
}

function renderContent(content) {
  if (!Array.isArray(content)) {
    return content;
  }

  return content.map((part, index) => {
    if (typeof part === "string") {
      return part;
    }

    if (part.type === "math") {
      return <InlineMath key={index} name={part.name} />;
    }

    if (part.type === "br") {
      return <br key={index} />;
    }

    if (part.type === "strong") {
      return <strong key={index}>{renderContent(part.content)}</strong>;
    }

    if (part.type === "em") {
      return <em key={index}>{renderContent(part.content)}</em>;
    }

    return null;
  });
}

function HintBody({ hint }) {
  return (
    <div className="hint-detail-body">
      {hint.blocks.map((block, index) => {
        if (block.type === "formula") {
          return (
            <div className="formula-row" key={`${hint.id}-${index}`}>
              <Formula name={block.formula} />
            </div>
          );
        }

        if (block.type === "image") {
          return (
            <figure className="hint-figure" key={`${hint.id}-${index}`}>
              <img src={hint.image} alt={hint.imageAlt} />
              <figcaption>{hint.imageAlt}</figcaption>
            </figure>
          );
        }

        return <p key={`${hint.id}-${index}`}>{renderContent(block.content)}</p>;
      })}
    </div>
  );
}

function HintDesk({ visibleHints, onShowHint }) {
  const [open, setOpen] = useState(false);
  const [activeHint, setActiveHint] = useState(null);

  function openHint(hint) {
    onShowHint(hint.id);
    setActiveHint(hint);
  }

  return (
    <>
      <section className="hint-desk">
        <span className="panel-label">Hintbalie</span>
        <button className="primary-button compact hint-desk-button" type="button" onClick={() => setOpen(true)}>
          Bekijk hints
        </button>
        <p>Alle {HINTS.length} hints zijn beschikbaar</p>
      </section>

      {open && (
        <div className="hint-shop-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="hint-shop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hint-shop-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span className="panel-label">Hintbalie</span>
                <h2 id="hint-shop-title">Kies een hint</h2>
              </div>
              <button className="icon-button compact" type="button" onClick={() => setOpen(false)}>
                Sluit
              </button>
            </header>

            <div className="hint-shop-grid">
              {HINTS.map((hint, index) => {
                const opened = visibleHints.includes(hint.id);

                return (
                  <button
                    className={`unlocked ${opened ? "opened" : ""}`}
                    key={hint.id}
                    type="button"
                    onClick={() => openHint(hint)}
                  >
                    <span>Hint {index + 1}</span>
                    <strong>{hint.title}</strong>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {activeHint && (
        <div className="hint-detail-backdrop" role="presentation" onMouseDown={() => setActiveHint(null)}>
          <section
            className="hint-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${activeHint.id}-title`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span className="panel-label">Hint</span>
                <h2 id={`${activeHint.id}-title`}>{activeHint.title}</h2>
              </div>
              <button className="icon-button compact" type="button" onClick={() => setActiveHint(null)}>
                Sluit
              </button>
            </header>
            <HintBody hint={activeHint} />
          </section>
        </div>
      )}
    </>
  );
}

export default HintDesk;
