/* eslint-disable no-unused-vars */
import React ,{ useState, useMemo } from "react";
import Controls from "./components/Controls";
import SVGPlot from "./components/SVGPlot";
import TermList from "./components/TermList";
import FormulaPanel from "./components/FormulaPanel";
import TeacherNotes from "./components/TeacherNotes";
import ExamplesPanel from "./components/ExamplesPanel";
import "./index.css";
import {
  generateArithmetic,
  generateGeometric,
  generateFibonacci,
  computeArithmeticNth,
  computeGeometricNth,
  arithmeticSum,
  geometricSum,
  formatNumber,
} from "./utils/suites";

export default function App() {
  const [type, setType] = useState("arith");
  const [a1, setA1] = useState(2);
  const [d, setD] = useState(3);
  const [r, setR] = useState(2);
  const [n, setN] = useState(8);
  const [showSum, setShowSum] = useState(false);
  const [logScale, setLogScale] = useState(false);

  const terms = useMemo(() => {
    const N = Math.max(1, Math.floor(n));
    if (type === "arith") return generateArithmetic(Number(a1), Number(d), N);
    if (type === "geo") return generateGeometric(Number(a1), Number(r), N);
    return generateFibonacci(N);
  }, [type, a1, d, r, n]);

  const nthTerm = useMemo(() => {
    if (type === "arith")
      return `${a1} + (${n - 1}) × ${d} = ${computeArithmeticNth(
        Number(a1),
        Number(d),
        Number(n)
      )}`;
    if (type === "geo")
      return `${a1} × ${r}^${n - 1} = ${computeGeometricNth(
        Number(a1),
        Number(r),
        Number(n)
      )}`;
    return `F_${n} = ${terms[terms.length - 1]}`;
  }, [type, a1, d, r, n, terms]);

  const sum = useMemo(() => {
    if (!showSum) return null;
    if (type === "arith") return arithmeticSum(Number(a1), Number(d), Number(n));
    if (type === "geo") return geometricSum(Number(a1), Number(r), Number(n));
    return null;
  }, [showSum, type, a1, d, r, n]);

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Simulateur de suites numériques
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controls
            type={type}
            a1={a1}
            d={d}
            r={r}
            n={n}
            showSum={showSum}
            logScale={logScale}
            setType={setType}
            setA1={setA1}
            setD={setD}
            setR={setR}
            setN={setN}
            setShowSum={setShowSum}
            setLogScale={setLogScale}
          />

          <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
            <SVGPlot terms={terms} logScale={logScale} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <TermList terms={terms} />
              <FormulaPanel nthTerm={nthTerm} sum={sum} showSum={showSum} />
            </div>
            <TeacherNotes type={type} />
          </div>

          <ExamplesPanel />
        </div>
      </div>
    </div>
  );
}
