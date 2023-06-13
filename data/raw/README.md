# Starrydata Dataset

## Overview

The Starrydata Dataset is a comprehensive collection of data on thermoelectric, battery, and magnetic materials. The dataset aims to provide researchers and scientists with valuable information for analysis and exploration in these fields.

## Data Collection Method

The data in this dataset has been meticulously collected from various research papers. To ensure accuracy and reliability, the data extraction process involved the use of WebPlotDigitizer and StarryDigitizer. These tools were employed to digitize plots, graphs, and visual representations found in the papers. By manually extracting the data, we could maintain the integrity of the information and ensure its usefulness for further analysis.

## Data Composition

The dataset comprises three main files:

- **Curves.csv**: This file contains the curve data extracted from research papers. It primarily focuses on thermoelectric, battery, and magnetic materials. Each row represents a specific data instance, while each column corresponds to a particular attribute of the curves. The columns include:

  - `SID`: Starrydata ID (SID)
  - `composition`: Sample composition
  - `sample_id`: Sample ID
  - `figure_id`: Figure ID
  - `prop_x`: Property (x)
  - `prop_y`: Property (y)
  - `unit_x`: Unit (x)
  - `unit_y`: Unit (y)
  - `x`: Value (x), referring to the property specified in `prop_x` and the corresponding unit in `unit_x`
  - `y`: Value (y), referring to the property specified in `prop_y` and the corresponding unit in `unit_y`
  - `project_names`: Associated project names

- **Samples.csv**: This file contains the sample data extracted from research papers. It mainly focuses on thermoelectric, battery, and magnetic materials. Each row represents a specific sample, while each column represents a particular attribute of the samples. The columns include:

  - `sample_name`: Sample name
  - `sample_id`: Sample ID
  - `composition`: Sample composition
  - `SID`: Starrydata ID (Paper ID)
  - `DOI`: DOI
  - `sample_info`: Sample detailed information in JSON format

- **Papers.csv**: This file contains metadata about the research papers from which the data was extracted. Each row represents a paper, and each column represents a specific attribute of the papers.

## Sample Information

The `sample_info` field in the **Samples.csv** file provides detailed information about each sample in JSON format. It follows the structure: `{sample_descriptor: {category: "", comment: ""}}`. The `sample_descriptor` field indicates the type of information provided for each project category.

For thermoelectric materials, the possible `sample_descriptor` values are:

- `MaterialFamily`
- `DataType`
- `Form`
- `FabricationProcess`
- `FabricationProcess 2`
- `FabricationProcess 3`
- `ElectricalMeasurement`
- `ThermalMeasurement`
- `Purity`
- `RelativeDensity`
- `GrainSize`
- `Other`
- `laser flash and different thermal analyzer`
- `Differential thermal analyzer`
- `LaserFlash`
- `DifferentialThermalAnalyzer`

For magnetic materials, the possible `sample_descriptor` values are:

- `DataType`
- `Form`
- `FabricationProcess`
- `MagneticMeasurement`
- `Purity`
- `RelativeDensity`
- `GrainSize`
- `saturation magnetization`
- `coercivity`
- ` coercivity`
- `magnetic field`
- `Measurement temperature`
- ` Measurement temperature`
- `emanence magnetion`
- `Saturation magnetization`
- `oercivity`
- `remanence magnetion`
- ` remanence magnetion`
- `  remanence magnetion`
- `saturation magnetizatio`

For battery materials, the possible `sample_descriptor` values are:

- `Cathode active material`
- `Cathode conductive agent`
- `Cathode binder 1`
- `Cathode binder 2`
- `Cathode additive 1`
- `Cathode additive 2`
- `Cathode current collector`
- `Anode active material`
- `Anode conductive agent`
- `Anode binder 1`
- `Anode binder 2`
- `Anode additive 1`
- `Anode additive 2`
- `Solvent 1`
- `Solvent 2`
- `Solvent 3`
- `Solute 1`
- `Solute 2`
- `Solute 3`
- `Electrolyte Additive 1`
- `Electrolyte Additive 2`
- `Electrolyte Additive 3`
- `Ratio of electrolyte to sulfur (E/S ratio)`
- `Cathode areal density (cathode loading)`
- `Cathode areal capacity`
- `Cathode volumetric density`
- `N/P ratio|A/C ratio`
- `Upper voltage limit`
- `Lower voltage limit`
- `Cell type`
- `Current density`
- `Anode areal capacity`
- `Hysteresis`
- `Coulombic efficiency`
- `Anode current collector`
- `Separator`

## Data Features

The dataset includes the following features related to thermoelectric materials:

- **Temperature**: Temperature in a specific unit.
- **Z-Seebeck coefficient**: The Z-Seebeck coefficient of the material.
- **Electrical resistivity**: The electrical resistivity of the material.
- **Electrical conductivity**: The electrical conductivity of the material.
- **Thermal conductivity**: The thermal conductivity of the material.
- **Power factor**: The power factor of the material.
- **ZT**: The ZT value of the material.
- **Carrier mobility**: The carrier mobility of the material.
- **Hall coefficient**: The Hall coefficient of the material.

The dataset includes the following features related to magnetic materials:

- **Temperature**: Temperature in a specific unit.
- **Magnetic field**: Magnetic field strength applied to the material.
- **Magnetic field strength (H)**: The magnetic field strength of the material.
- **Magnetization**: The magnetization of the material.
- **Magnetization per weight**: Magnetization per unit weight of the material.
- **Magnetization per volume**: Magnetization per unit volume of the material.
- **Magnetization (Bohr)**: The Bohr magnetization of the material.

The dataset includes the following features related to battery materials:

- **C rate**: The C rate of the battery.
- **Cycle number**: The cycle number of the battery.
- **Voltage**: The voltage of the battery.
- **Discharge capacity**: The discharge capacity of the battery.
- **Charge capacity**: The charge capacity of the battery.

## License

This dataset is provided under the XXX License. For detailed information regarding the terms of use and any restrictions, please refer to the LICENSE file.

## Usage Examples

Below are examples of how to use the dataset:

```python
import pandas as pd

# Load the curve data
curves = pd.read_csv('Curves.csv')

# Load the sample data
samples = pd.read_csv('Samples.csv')

# Load the paper metadata
papers = pd.read_csv('Papers.csv')

# Perform data analysis, visualization, etc.
# ...
```

## Dataset Changelog

- June 13, 2023: Initial release

## Contact Information

If you have any questions or feedback, please contact us at:

- Email: starrydata1@gmail.com