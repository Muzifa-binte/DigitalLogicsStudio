import React from 'react';

export const InputControls = ({
    numVariables,
    variables,
    inputValue, 
    dontCares,
    optimizationType,
    onVariablesChange,
    onVariablesUpdate,
    onInputValueChange, 
    onDontCaresChange,
    onOptimizationTypeChange,
    onGenerate,
    onExample,
    onReset
}) => {
    const handleVariableNameChange = (index, value) => {
        const newVars = [...variables];
        newVars[index] = value.toUpperCase().charAt(0) || variables[index];
        onVariablesUpdate(newVars);
    };

    const isSOP = optimizationType === "SOP";
    const termLabel = isSOP ? "Minterms" : "Maxterms";
    const examplePlaceholder = isSOP ? "e.g., 0,1,2,5,6,7" : "e.g., 3,4,8,11";

    return (
        <div className="kmap-card">
            <h2 className="kmap-section-title">Configuration</h2>

            <div className="kmap-controls-grid">
                <div className="kmap-control-group">
                    <label className="kmap-label">Number of Variables</label>
                    <select
                        className="kmap-input"
                        value={numVariables}
                        onChange={(e) => onVariablesChange(e.target.value)}
                    >
                        <option value="2">2 Variables</option>
                        <option value="3">3 Variables</option>
                        <option value="4">4 Variables</option>
                    </select>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label">Variable Names</label>
                    <div className="kmap-var-inputs">
                        {variables.map((variable, index) => (
                            <input
                                key={index}
                                type="text"
                                className="kmap-input kmap-var-input"
                                value={variable}
                                onChange={(e) => handleVariableNameChange(index, e.target.value)}
                                maxLength="1"
                            />
                        ))}
                    </div>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label">{termLabel} (comma-separated)</label>
                    <input
                        type="text"
                        className="kmap-input"
                        value={inputValue} 
                        onChange={(e) => onInputValueChange(e.target.value)} 
                        placeholder={examplePlaceholder} 
                    />
                    <p className="kmap-helper-text">
                        Enter decimal {termLabel.toLowerCase} numbers (0 to {Math.pow(2, numVariables) - 1})
                    </p>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label">Don't Cares (comma-separated, optional)</label>
                    <input
                        type="text"
                        className="kmap-input"
                        value={dontCares}
                        onChange={(e) => onDontCaresChange(e.target.value)}
                        placeholder="e.g., 3,4,12"
                    />
                    <p className="kmap-helper-text">
                        Don't care terms can be treated as 0 or 1 for optimal grouping
                    </p>
                </div>

                <div className="kmap-control-group">
                    <label className="kmap-label">Optimization Type</label>
                    <select
                        className="kmap-input"
                        value={optimizationType}
                        onChange={(e) => onOptimizationTypeChange(e.target.value)}
                    >
                        <option value="SOP">Sum of Products (SOP)</option>
                        <option value="POS">Product of Sums (POS)</option>
                    </select>
                    <p className="kmap-helper-text">
                        SOP: F = Σ minterms | POS: F = Π maxterms
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }} className="kmap-btn-row">
                    <button
                        className="kmap-btn kmap-btn-primary"
                        onClick={onGenerate}
                    >
                        Generate K-Map
                    </button>
                    <button
                        className="kmap-btn kmap-btn-secondary"
                        onClick={onExample}
                    >
                        Load Example
                    </button>
                    <button
                        className="kmap-btn kmap-btn-outline"
                        onClick={onReset}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};
