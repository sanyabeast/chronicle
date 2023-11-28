## Prerequisites

### Install Visual Studio:

- The 2017 version is recommended.

### Set Up System Environment Variables:

- Navigate to: Control Panel > System > Advanced System Settings > Advanced > Environment Variables.
- Add the following:
  
`SCE_ROOT_DIR: C:\Program Files (x86)\SCE`

`SCE_PSP2_SDK_DIR: C:\Program Files (x86)\SCE\PSP2 SDKs\3.570`
### Relocate SDK Directory:

- Move the "SDK/SCE/" folder to "Program Files (x86)/" so that the path becomes "C:\Program Files (x86)\SCE".
  
### Install Unity with PSP2 Support:

First, install the main Unity editor: "UnitySetup64-2018.2.19f1.exe"
Next, add PSP2 support: "UnitySetup-Playstation-Vita-Support-for-Editor-2018.2.19f1.exe"

### Patch Unity:

- Use the tool provided: "UniPatcher2018_v1.exe"
  
## Development & Build
1. Develop your Homebrew application.
2. Build the project for PSP2 using Unity's build menu.
3. Convert the Unity build to a .vpk file using the **SilicaVPK.py** tool.

*Have any questions? [Email me](mailto:a.gvrnsk@gmail.com?subject=psp2)*