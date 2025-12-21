#!/bin/bash

# Exit on error
set -e

# Check platform
platform=$(uname)

if [[ "$platform" == "Darwin" ]]; then
    echo "Running on macOS. Note that the AppImage created will only work on Linux systems."
    if ! command -v docker &> /dev/null; then
        echo "Docker Desktop for Mac is not installed. Please install it from https://www.docker.com/products/docker-desktop"
        exit 1
    fi
elif [[ "$platform" == "Linux" ]]; then
    echo "Running on Linux. Proceeding with AppImage creation..."
else
    echo "This script is intended to run on macOS or Linux. Current platform: $platform"
    exit 1
fi

# Enable BuildKit
export DOCKER_BUILDKIT=1

BUILD_IMAGE_NAME="void-appimage-builder"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Check and install Buildx if needed
if ! docker buildx version >/dev/null 2>&1; then
    echo "Installing Docker Buildx..."
    mkdir -p ~/.docker/cli-plugins/
    curl -SL https://github.com/docker/buildx/releases/download/v0.13.1/buildx-v0.13.1.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx
    chmod +x ~/.docker/cli-plugins/docker-buildx
fi

# Download appimagetool if not present
if [ ! -f "appimagetool" ]; then
    echo "Downloading appimagetool..."
    wget -O appimagetool "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage"
    chmod +x appimagetool
fi

# Delete any existing AppImage to avoid bloating the build
rm -f Syfer-x86_64.AppImage

# Create build Dockerfile
echo "Creating build Dockerfile..."
cat > Dockerfile.build << 'EOF'
# syntax=docker/dockerfile:1
FROM ubuntu:20.04

# Install required dependencies
RUN apt-get update && apt-get install -y \
    libfuse2 \
    libglib2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxss1 \
    libxtst6 \
    libnss3 \
    libasound2 \
    libdrm2 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
EOF

# Create .dockerignore file
echo "Creating .dockerignore file..."
cat > .dockerignore << EOF
Dockerfile.build
.dockerignore
.git
.gitignore
.DS_Store
*~
*.swp
*.swo
*.tmp
*.bak
*.log
*.err
node_modules/
venv/
*.egg-info/
*.tox/
dist/
EOF

# Build Docker image without cache
echo "Building Docker image (no cache)..."
docker build --no-cache -t "$BUILD_IMAGE_NAME" -f Dockerfile.build .

# Create AppImage using local appimagetool
echo "Creating AppImage..."
docker run --rm --privileged -v "$(pwd):/app" "$BUILD_IMAGE_NAME" bash -c '
cd /app && \
rm -rf SyferApp.AppDir && \
mkdir -p SyferApp.AppDir/usr/bin SyferApp.AppDir/usr/lib SyferApp.AppDir/usr/share/applications && \
find . -maxdepth 1 ! -name SyferApp.AppDir ! -name "." ! -name ".." -exec cp -r {} SyferApp.AppDir/usr/bin/ \; && \
cp void.png SyferApp.AppDir/ && \
echo "[Desktop Entry]" > SyferApp.AppDir/void.desktop && \
echo "Name=Syfer" >> SyferApp.AppDir/void.desktop && \
echo "Comment=Open source AI code editor." >> SyferApp.AppDir/void.desktop && \
echo "GenericName=Text Editor" >> SyferApp.AppDir/void.desktop && \
echo "Exec=void %F" >> SyferApp.AppDir/void.desktop && \
echo "Icon=void" >> SyferApp.AppDir/void.desktop && \
echo "Type=Application" >> SyferApp.AppDir/void.desktop && \
echo "StartupNotify=false" >> SyferApp.AppDir/void.desktop && \
echo "StartupWMClass=Syfer" >> SyferApp.AppDir/void.desktop && \
echo "Categories=TextEditor;Development;IDE;" >> SyferApp.AppDir/void.desktop && \
echo "MimeType=application/x-void-workspace;" >> SyferApp.AppDir/void.desktop && \
echo "Keywords=void;" >> SyferApp.AppDir/void.desktop && \
echo "Actions=new-empty-window;" >> SyferApp.AppDir/void.desktop && \
echo "[Desktop Action new-empty-window]" >> SyferApp.AppDir/void.desktop && \
echo "Name=New Empty Window" >> SyferApp.AppDir/void.desktop && \
echo "Name[de]=Neues leeres Fenster" >> SyferApp.AppDir/void.desktop && \
echo "Name[es]=Nueva ventana vacía" >> SyferApp.AppDir/void.desktop && \
echo "Name[fr]=Nouvelle fenêtre vide" >> SyferApp.AppDir/void.desktop && \
echo "Name[it]=Nuova finestra vuota" >> SyferApp.AppDir/void.desktop && \
echo "Name[ja]=新しい空のウィンドウ" >> SyferApp.AppDir/void.desktop && \
echo "Name[ko]=새 빈 창" >> SyferApp.AppDir/void.desktop && \
echo "Name[ru]=Новое пустое окно" >> SyferApp.AppDir/void.desktop && \
echo "Name[zh_CN]=新建空窗口" >> SyferApp.AppDir/void.desktop && \
echo "Name[zh_TW]=開新空視窗" >> SyferApp.AppDir/void.desktop && \
echo "Exec=void --new-window %F" >> SyferApp.AppDir/void.desktop && \
echo "Icon=void" >> SyferApp.AppDir/void.desktop && \
chmod +x SyferApp.AppDir/void.desktop && \
cp SyferApp.AppDir/void.desktop SyferApp.AppDir/usr/share/applications/ && \
echo "[Desktop Entry]" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Name=Syfer - URL Handler" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Comment=Open source AI code editor." > SyferApp.AppDir/void-url-handler.desktop && \
echo "GenericName=Text Editor" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Exec=void --open-url %U" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Icon=void" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Type=Application" > SyferApp.AppDir/void-url-handler.desktop && \
echo "NoDisplay=true" > SyferApp.AppDir/void-url-handler.desktop && \
echo "StartupNotify=true" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Categories=Utility;TextEditor;Development;IDE;" > SyferApp.AppDir/void-url-handler.desktop && \
echo "MimeType=x-scheme-handler/void;" > SyferApp.AppDir/void-url-handler.desktop && \
echo "Keywords=void;" > SyferApp.AppDir/void-url-handler.desktop && \
chmod +x SyferApp.AppDir/void-url-handler.desktop && \
cp SyferApp.AppDir/void-url-handler.desktop SyferApp.AppDir/usr/share/applications/ && \
echo "#!/bin/bash" > SyferApp.AppDir/AppRun && \
echo "HERE=\$(dirname \"\$(readlink -f \"\${0}\")\")" >> SyferApp.AppDir/AppRun && \
echo "export PATH=\${HERE}/usr/bin:\${PATH}" >> SyferApp.AppDir/AppRun && \
echo "export LD_LIBRARY_PATH=\${HERE}/usr/lib:\${LD_LIBRARY_PATH}" >> SyferApp.AppDir/AppRun && \
echo "exec \${HERE}/usr/bin/void --no-sandbox \"\$@\"" >> SyferApp.AppDir/AppRun && \
chmod +x SyferApp.AppDir/AppRun && \
chmod -R 755 SyferApp.AppDir && \

# Strip unneeded symbols from the binary to reduce size
strip --strip-unneeded SyferApp.AppDir/usr/bin/void

ls -la SyferApp.AppDir/ && \
ARCH=x86_64 ./appimagetool -n SyferApp.AppDir Syfer-x86_64.AppImage
'

# Clean up
rm -rf SyferApp.AppDir .dockerignore appimagetool

echo "AppImage creation complete! Your AppImage is: Syfer-x86_64.AppImage"
