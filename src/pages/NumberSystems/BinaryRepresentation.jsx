import React, { useState, useEffect } from 'react';
import NSLayout from './components/NSLayout';

export default function BinaryRepresentation() {
    const [smInput, setSmInput] = useState('');
    const [smPadding, setSmPadding] = useState(0);
    const [smResult, setSmResult] = useState(null);
    const [smBitsInput, setSmBitsInput] = useState(8);
    const [smRange, setSmRange] = useState({ min: 0, max: 0, distinct: 0 });
    const [showSmChart, setShowSmChart] = useState(false);

    const [tcInput, setTcInput] = useState('');
    const [tcPadding, setTcPadding] = useState(0);
    const [tcResult, setTcResult] = useState(null);
    const [tcBitsInput, setTcBitsInput] = useState(8);
    const [tcRange, setTcRange] = useState({ min: 0, max: 0, distinct: 0 });
    const [showTcChart, setShowTcChart] = useState(false);
    const [unsignedBits, setUnsignedBits] = useState(8);
    const [unsignedRange, setUnsignedRange] = useState({ min: 0, max: 255, distinct: 256 });

    useEffect(() => {
        const n = parseInt(smBitsInput, 10);
        if (!isNaN(n) && n > 0 && n <= 53) {
            const max = Math.pow(2, n - 1) - 1;
            setSmRange({ min: -max, max, distinct: Math.pow(2, n) });
        } else {
            setSmRange(null);
        }
    }, [smBitsInput]);

    useEffect(() => {
        const n = parseInt(tcBitsInput, 10);
        if (!isNaN(n) && n > 0 && n <= 53) {
            const max = Math.pow(2, n - 1) - 1;
            setTcRange({ min: -Math.pow(2, n - 1), max, distinct: Math.pow(2, n) });
        } else {
            setTcRange(null);
        }
    }, [tcBitsInput]);

    useEffect(() => {
        const n = parseInt(unsignedBits, 10);
        if (!isNaN(n) && n > 0 && n <= 53) {
            const max = Math.pow(2, n) - 1;
            setUnsignedRange({ min: 0, max, distinct: Math.pow(2, n) });
        } else {
            setUnsignedRange(null);
        }
    }, [unsignedBits]);

    useEffect(() => {
        if (!smInput || smInput === '-' || smInput === '+') { setSmResult(null); return; }
        const num = parseInt(smInput, 10);
        if (isNaN(num)) return;
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) { setSmResult({ error: "Number too large" }); return; }

        const isNegative = num < 0;
        const magnitude = Math.abs(num);
        let binaryStr = magnitude.toString(2);
        const totalMagnitudeBits = Math.max(binaryStr.length, binaryStr.length + smPadding);
        setSmResult({
            signBit: isNegative ? '1' : '0',
            magnitudeBits: binaryStr.padStart(totalMagnitudeBits, '0'),
            totalBits: totalMagnitudeBits + 1,
            decimal: num.toString(),
            error: null
        });
    }, [smInput, smPadding]);

    useEffect(() => {
        if (!tcInput || tcInput === '-' || tcInput === '+') { setTcResult(null); return; }
        const num = parseInt(tcInput, 10);
        if (isNaN(num)) return;
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) { setTcResult({ error: "Number too large" }); return; }

        let minBits;
        if (num >= 0) {
            minBits = num.toString(2).length + 1;
        } else {
            let abs = Math.abs(num);
            let bits = abs.toString(2).length;
            if (num < -Math.pow(2, bits - 1)) bits++;
            minBits = bits + 1;
        }

        const targetBits = Math.max(minBits, minBits + tcPadding);
        let binary = num >= 0
            ? num.toString(2).padStart(targetBits, '0')
            : (Math.pow(2, targetBits) + num).toString(2);

        setTcResult({
            binary,
            signBit: binary[0],
            remainingBits: binary.slice(1),
            totalBits: targetBits,
            decimal: num.toString(),
            error: null
        });
    }, [tcInput, tcPadding]);

    const generateChartData = (type) => {
        const data = [];
        for (let i = 10; i >= -10; i--) {
            let binary = '';
            if (type === 'SM') {
                const abs = Math.abs(i);
                const bin = abs.toString(2).padStart(4, '0');
                binary = i === 0 ? `0${bin}` : (i < 0 ? '1' : '0') + bin;
            } else {
                binary = i >= 0 ? i.toString(2).padStart(5, '0') : (32 + i).toString(2);
            }
            data.push({ dec: i, bin: binary });
        }
        return data;
    };

    return (
        <NSLayout
            title="Binary Representation"
            subtitle="Signed Magnitude, Two's Complement, and Unsigned"
            intro="Learn how computers encode positive and negative integers in binary. Explore the three most common representations side-by-side."
        >
            <section className="binary-card binary-overview-card">
                <h2 className="binary-section-title binary-title-primary">
                    <span className="binary-dot binary-dot-primary"></span>
                    Quick idea
                </h2>
                <p className="binary-text">
                    A bit pattern is just a row of 0s and 1s. The same row can mean different numbers depending on the rule used to read it.
                    These three rules answer one question: does the leftmost bit belong to the value, or does it describe the sign?
                </p>
                <div className="binary-concept-grid">
                    <div className="binary-concept-card">
                        <span className="binary-concept-label">Unsigned</span>
                        <p>All bits are value bits, so the number is never negative.</p>
                    </div>
                    <div className="binary-concept-card">
                        <span className="binary-concept-label">Signed magnitude</span>
                        <p>The first bit stores the sign. The remaining bits store the size.</p>
                    </div>
                    <div className="binary-concept-card">
                        <span className="binary-concept-label">Two's complement</span>
                        <p>The first bit has negative weight, which makes addition and subtraction work naturally.</p>
                    </div>
                </div>
            </section>

            <div className="binary-wrapper">
                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-primary">
                        <span className="binary-dot binary-dot-primary"></span>
                        Signed Magnitude
                    </h2>

                    <div className="binary-info-box binary-info-primary">
                        <h3 className="binary-info-heading">How it works:</h3>
                        <p className="binary-text">
                            <span className="binary-highlight-primary">Leftmost bit</span> is sign (0=+, 1=-). Remaining bits are magnitude.
                        </p>
                        <p className="binary-text">
                            Think of it like writing a normal decimal number with a plus or minus sign in front. The sign bit tells the direction,
                            and the magnitude bits tell how far from zero the value is.
                        </p>

                        <button className="binary-toggle-btn" onClick={() => setShowSmChart(!showSmChart)}>
                            {showSmChart ? "Hide Reference Chart (-10 to 10)" : "Show Reference Chart (-10 to 10)"}
                        </button>

                        {showSmChart && (
                            <div className="binary-table-container">
                                <table className="binary-table">
                                    <thead className="binary-table-header">
                                        <tr>
                                            <th>Decimal</th>
                                            <th className="binary-table-cell-right">5-Bit Binary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateChartData('SM').map((row) => (
                                            <tr key={row.dec} className="binary-table-row">
                                                <td className="binary-table-cell">{row.dec}</td>
                                                <td className="binary-table-cell binary-table-cell-right binary-table-cell-mono binary-table-cell-primary">
                                                    <span className="binary-table-cell-danger">{row.bin[0]}</span>
                                                    {row.bin.slice(1)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                How to calculate signed magnitude
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li>Choose the total number of bits. One bit is reserved for the sign.</li>
                                    <li>Use <strong>0</strong> for a positive number and <strong>1</strong> for a negative number.</li>
                                    <li>Convert the absolute value to binary using the remaining bits.</li>
                                    <li>Place the sign bit at the left.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-primary">-5 in 5 bits</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>Sign:</strong> negative, so the first bit is <span className="binary-highlight-primary">1</span>.</li>
                                    <li><strong>Magnitude:</strong> |-5| = 5.</li>
                                    <li><strong>Magnitude in 4 bits:</strong> 5 = 0101.</li>
                                    <li><strong>Final:</strong> <span className="binary-highlight-primary">1</span>0101.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="binary-callout">
                            Signed magnitude has two zeros: +0 is 00000 and -0 is 10000. That is why real processors usually prefer two's complement.
                        </div>
                    </div>

                    {/* SM Calculator */}
                    <div className="binary-info-box binary-info-tertiary">
                        <h3 className="binary-info-heading">Signed Magnitude Calculator</h3>
                        <div className="binary-input-group">
                            <label className="binary-label">Decimal value:</label>
                            <input
                                className="binary-input"
                                type="number"
                                value={smInput}
                                onChange={(e) => setSmInput(e.target.value)}
                                placeholder="e.g. -5"
                            />
                        </div>
                        <div className="binary-input-group">
                            <label className="binary-label">Extra padding bits: {smPadding}</label>
                            <input
                                className="binary-range"
                                type="range"
                                min="0"
                                max="8"
                                value={smPadding}
                                onChange={(e) => setSmPadding(parseInt(e.target.value))}
                            />
                        </div>
                        {smResult && !smResult.error && (
                            <div className="binary-result">
                                <p><strong>Sign bit:</strong> <span className="binary-highlight-primary">{smResult.signBit}</span></p>
                                <p><strong>Magnitude bits:</strong> {smResult.magnitudeBits}</p>
                                <p><strong>Full representation:</strong> <span className="binary-highlight-primary">{smResult.signBit}</span>{smResult.magnitudeBits}</p>
                                <p><strong>Total bits:</strong> {smResult.totalBits}</p>
                            </div>
                        )}
                        {smResult?.error && <p className="binary-error">{smResult.error}</p>}
                    </div>

                    {/* SM Range */}
                    <div className="binary-info-box binary-info-secondary">
                        <h3 className="binary-info-heading">Range Calculator</h3>
                        <div className="binary-input-group">
                            <label className="binary-label">Bit width:</label>
                            <input
                                className="binary-input"
                                type="number"
                                min="1" max="53"
                                value={smBitsInput}
                                onChange={(e) => setSmBitsInput(e.target.value)}
                            />
                        </div>
                        {smRange && (
                            <div className="binary-result">
                                <p><strong>Min:</strong> {smRange.min}</p>
                                <p><strong>Max:</strong> {smRange.max}</p>
                                <p><strong>Distinct values:</strong> {smRange.distinct} (includes ±0)</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Two's Complement */}
                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-secondary">
                        <span className="binary-dot binary-dot-secondary"></span>
                        Two's Complement
                    </h2>

                    <div className="binary-info-box binary-info-secondary">
                        <h3 className="binary-info-heading">How it works:</h3>
                        <p className="binary-text">
                            Invert all bits, then add 1. <span className="binary-highlight-secondary">One unique zero</span>, wider range.
                        </p>
                        <p className="binary-text">
                            Two's complement is the standard way computers store signed integers. For positive values, write normal binary.
                            For negative values, use the fixed bit width and wrap around from 2^n.
                        </p>

                        <button className="binary-toggle-btn" onClick={() => setShowTcChart(!showTcChart)}>
                            {showTcChart ? "Hide Reference Chart (-10 to 10)" : "Show Reference Chart (-10 to 10)"}
                        </button>

                        {showTcChart && (
                            <div className="binary-table-container">
                                <table className="binary-table">
                                    <thead className="binary-table-header">
                                        <tr>
                                            <th>Decimal</th>
                                            <th className="binary-table-cell-right">5-Bit Two's Complement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateChartData('TC').map((row) => (
                                            <tr key={row.dec} className="binary-table-row">
                                                <td className="binary-table-cell">{row.dec}</td>
                                                <td className="binary-table-cell binary-table-cell-right binary-table-cell-mono binary-table-cell-secondary">
                                                    <span className="binary-table-cell-danger">{row.bin[0]}</span>
                                                    {row.bin.slice(1)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                How to calculate a negative value
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li>Choose the bit width first. The width matters.</li>
                                    <li>Write the positive magnitude in that many bits.</li>
                                    <li>Flip every bit: 0 becomes 1, and 1 becomes 0.</li>
                                    <li>Add 1 to the flipped result.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-secondary">-13 in 8 bits</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>+13:</strong> 00001101.</li>
                                    <li><strong>Invert:</strong> 11110010.</li>
                                    <li><strong>Add 1:</strong> 11110010 + 1 = 11110011.</li>
                                    <li><strong>Final:</strong> 11110011 represents -13.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="binary-callout">
                            Shortcut: in n bits, a negative number can also be found with 2^n - value. For -13 in 8 bits: 256 - 13 = 243, and 243 is 11110011.
                        </div>
                    </div>

                    {/* TC Calculator */}
                    <div className="binary-info-box binary-info-tertiary">
                        <h3 className="binary-info-heading">Two's Complement Calculator</h3>
                        <div className="binary-input-group">
                            <label className="binary-label">Decimal value:</label>
                            <input
                                className="binary-input"
                                type="number"
                                value={tcInput}
                                onChange={(e) => setTcInput(e.target.value)}
                                placeholder="e.g. -13"
                            />
                        </div>
                        <div className="binary-input-group">
                            <label className="binary-label">Extra padding bits: {tcPadding}</label>
                            <input
                                className="binary-range"
                                type="range"
                                min="0" max="8"
                                value={tcPadding}
                                onChange={(e) => setTcPadding(parseInt(e.target.value))}
                            />
                        </div>
                        {tcResult && !tcResult.error && (
                            <div className="binary-result">
                                <p><strong>Sign bit:</strong> <span className="binary-highlight-secondary">{tcResult.signBit}</span></p>
                                <p><strong>Value bits:</strong> {tcResult.remainingBits}</p>
                                <p><strong>Full representation:</strong> <span className="binary-highlight-secondary">{tcResult.signBit}</span>{tcResult.remainingBits}</p>
                                <p><strong>Total bits:</strong> {tcResult.totalBits}</p>
                            </div>
                        )}
                        {tcResult?.error && <p className="binary-error">{tcResult.error}</p>}
                    </div>

                    {/* TC Range */}
                    <div className="binary-info-box binary-info-primary">
                        <h3 className="binary-info-heading">Range Calculator</h3>
                        <div className="binary-input-group">
                            <label className="binary-label">Bit width:</label>
                            <input
                                className="binary-input"
                                type="number"
                                min="1" max="53"
                                value={tcBitsInput}
                                onChange={(e) => setTcBitsInput(e.target.value)}
                            />
                        </div>
                        {tcRange && (
                            <div className="binary-result">
                                <p><strong>Min:</strong> {tcRange.min}</p>
                                <p><strong>Max:</strong> {tcRange.max}</p>
                                <p><strong>Distinct values:</strong> {tcRange.distinct}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Unsigned */}
                <section className="binary-card">
                    <h2 className="binary-section-title binary-title-amber">
                        <span className="binary-dot binary-dot-amber"></span>
                        Unsigned Integers
                    </h2>
                    <div className="binary-info-box binary-info-amber">
                        <h3 className="binary-info-heading">How it works:</h3>
                        <p className="binary-text">
                            Unsigned representation is the simplest form: every bit contributes a positive power of 2.
                            There is no sign bit, so the smallest value is always 0.
                        </p>

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">How to calculate unsigned binary</h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li>Label the bit positions from right to left: 1, 2, 4, 8, 16, and so on.</li>
                                    <li>Keep the place values where the bit is 1.</li>
                                    <li>Add those place values together.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="binary-reference-section">
                            <h4 className="binary-reference-title">
                                Example: <span className="binary-highlight-amber">101101</span>
                            </h4>
                            <div className="binary-example-box">
                                <ol className="binary-list">
                                    <li><strong>Place values:</strong> 32, 16, 8, 4, 2, 1.</li>
                                    <li><strong>Active bits:</strong> 32 + 8 + 4 + 1.</li>
                                    <li><strong>Final:</strong> 101101 = 45.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="binary-callout">
                            With n bits, unsigned range is 0 to 2^n - 1. With 8 bits, that is 0 to 255.
                        </div>
                    </div>

                    <div className="binary-info-box binary-info-amber">
                        <h3 className="binary-info-heading">Range Calculator</h3>
                        <div className="binary-input-group">
                            <label className="binary-label">Bit width:</label>
                            <input
                                className="binary-input"
                                type="number"
                                min="1" max="53"
                                value={unsignedBits}
                                onChange={(e) => setUnsignedBits(e.target.value)}
                            />
                        </div>
                        {unsignedRange && (
                            <div className="binary-result">
                                <p><strong>Min:</strong> {unsignedRange.min}</p>
                                <p><strong>Max:</strong> {unsignedRange.max}</p>
                                <p><strong>Distinct values:</strong> {unsignedRange.distinct}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </NSLayout>
    );
}
