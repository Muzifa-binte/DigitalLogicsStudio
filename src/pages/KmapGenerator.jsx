import React, { useState } from 'react';
import { InputControls } from '../components/InputControls';
import { KMapDisplay } from '../components/KMapDisplay';
import { SimplifiedExpression } from '../components/SimplifiedExpression';
import { GroupingGuide } from '../components/GroupingGuide';
import { TruthTableDisplay } from '../components/TruthTableDisplay';
import { useKMapLogic } from '../hooks/useKMapLogic';
import Boolforge from './Boolforge';
import RelatedSeoLinks from '../components/seo/RelatedSeoLinks';
import { trackToolInteraction } from '../utils/analytics';
import { Navbar } from './Home/Navbar';
import Footer from './Home/Footer';
import { useTheme } from '../context/ThemeContext';

const KMapGenerator = () => {
    const { theme, toggle: toggleTheme } = useTheme();
    const [numVariables, setNumVariables] = useState(3);
    const [variables, setVariables] = useState(['A', 'B', 'C']);
    const [inputValue, setInputValue] = useState('');
    const [dontCares, setDontCares] = useState('');
    const [optimizationType, setOptimizationType] = useState('SOP');
    const [showSolution, setShowSolution] = useState(false);
    const [showGroupingGuide, setShowGroupingGuide] = useState(false);
    const [showCircuitModal, setShowCircuitModal] = useState(false);

    const {
        grid,
        expression,
        groups,
        getColumnLabels,
        getRowLabels
    } = useKMapLogic(numVariables, variables, inputValue, dontCares, optimizationType);

    const handleVariablesChange = (value) => {
        const num = parseInt(value);
        setNumVariables(num);
        const defaultVars = ['A', 'B', 'C', 'D'];
        setVariables(defaultVars.slice(0, num));
        setShowSolution(false);
    };

    const handleExample = () => {
        trackToolInteraction('kmap_generator', 'load_example', {
            variable_count: numVariables,
        });
        if (numVariables === 3) {
            setInputValue('0,1,2,5,6,7'); // CHANGE: Updated to setInputValue
            setDontCares('3,4');
        } else if (numVariables === 4) {
            setInputValue('0,1,2,5,6,7,8,9,10,14'); // CHANGE: Updated to setInputVa
            setDontCares('3,11,12,13,15');
        } else {
            setInputValue('0,2,3'); // CHANGE: Updated to setInputValue
            setDontCares('1');
        }
        setShowSolution(false);
    };

    const handleReset = () => {
        trackToolInteraction('kmap_generator', 'reset', {
            variable_count: numVariables,
        });
        setInputValue(''); // CHANGE: Updated to setInputValue
        setDontCares('');
        setShowSolution(false);
        setShowGroupingGuide(false);
    };

    return (
        <div className={`kmap-page theme-${theme}`}>
            <div className="grid-background" />
            <Navbar toggleTheme={toggleTheme} theme={theme} />

            <main className="kmap-page-main">
                <div className="kmap-container">
                    <div className="kmap-header-gradient">
                        <h1 className="kmap-main-title">Karnaugh Map Generator</h1>
                        <p className="kmap-subtitle">Simplify Boolean expressions with interactive K-Maps</p>
                    </div>

            <div className="kmap-content-wrapper">
                <InputControls
                    numVariables={numVariables}
                    variables={variables}
                    inputValue={inputValue}
                    dontCares={dontCares}
                    optimizationType={optimizationType}
                    onVariablesChange={handleVariablesChange}
                    onVariablesUpdate={setVariables}
                    onInputValueChange={setInputValue}
                    onDontCaresChange={setDontCares}
                    onOptimizationTypeChange={setOptimizationType}
                    onGenerate={() => {
                        trackToolInteraction('kmap_generator', 'generate_solution', {
                            variable_count: numVariables,
                            optimization_type: optimizationType,
                        });
                        setShowSolution(true);
                    }}
                    onExample={handleExample}
                    onReset={handleReset}
                />

                {showSolution && (
                    <>
                        <KMapDisplay
                            grid={grid}
                            groups={groups}
                            numVariables={numVariables}
                            variables={variables}
                            getColumnLabels={getColumnLabels}
                            getRowLabels={getRowLabels}
                            showGroupingGuide={showGroupingGuide}
                            optimizationType={optimizationType}
                        />

                        <SimplifiedExpression
                            expression={expression}
                            showGroupingGuide={showGroupingGuide}
                            onToggleGuide={() => setShowGroupingGuide(!showGroupingGuide)}
                        />

                        {/* Circuit Experiment Button */}
                        <div className="kmap-card">
                            <button
                                className="kmap-btn kmap-btn-primary kmap-btn-full"
                                onClick={() => setShowCircuitModal(true)}
                                style={{
                                    marginTop: 'var(--spacing-md)',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '1.05rem',
                                    padding: 'var(--spacing-md) var(--spacing-lg)'
                                }}
                            >
                                🔌 Experiment with Circuit
                            </button>
                        </div>

                        {showGroupingGuide && (
                            <GroupingGuide
                                groups={groups}
                                variables={variables}
                                numVariables={numVariables}
                                grid={grid}
                                getColumnLabels={getColumnLabels}
                                getRowLabels={getRowLabels}
                                optimizationType={optimizationType}
                            />
                        )}

                        <TruthTableDisplay
                            numVariables={numVariables}
                            variables={variables}
                            inputValue={inputValue}
                            dontCares={dontCares}
                            optimizationType={optimizationType}
                        />
                    </>
                )}
            </div>

            {/* Circuit Modal */}
            {showCircuitModal && (
                <div
                    className="circuit-modal-overlay"
                    onClick={(e) => {
                        if (e.target.className === 'circuit-modal-overlay') {
                            setShowCircuitModal(false);
                        }
                    }}
                >
                    <div className="circuit-modal-container">
                        <button
                            className="circuit-modal-close"
                            onClick={() => setShowCircuitModal(false)}
                            title="Close Circuit Editor"
                        >
                            ✕
                        </button>
                        <Boolforge
                            simplifiedExpression={expression}
                            variables={variables}
                            embedded={true}
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                .circuit-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                    backdrop-filter: blur(4px);
                }

                .circuit-modal-container {
                    position: relative;
                    width: 95vw;
                    height: 90vh;
                    background: var(--bg-primary, #0f172a);
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    border: 2px solid rgba(99, 102, 241, 0.3);
                }

                .circuit-modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    font-size: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .circuit-modal-close:hover {
                    background: rgba(220, 38, 38, 1);
                    transform: rotate(90deg) scale(1.1);
                    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
                }

                .circuit-modal-close:active {
                    transform: rotate(90deg) scale(0.95);
                }

                @media (max-width: 768px) {
                    .circuit-modal-container {
                        width: 100vw;
                        height: 100vh;
                        border-radius: 0;
                    }

                    .circuit-modal-overlay {
                        padding: 0;
                    }
                }
            `}</style>
            <RelatedSeoLinks />
                </div>{/* end .kmap-container */}
            </main>

            <Footer />
        </div>
    );
};

export default KMapGenerator;
