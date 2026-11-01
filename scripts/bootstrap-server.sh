#!/usr/bin/env bash
# FairHire AI - Production Server Bootstrap Script
# Hardened VPS provisioning script for Ubuntu 22.04 / 24.04 LTS
set -euo pipefail

# Ensure script is executed with root privileges
if [[ "${EUID}" -ne 0 ]]; then
  echo "Error: This bootstrap script must be run as root or with sudo." >&2
  exit 1
fi

echo "=== [1/6] Updating system packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  ufw \
  fail2ban \
  unattended-upgrades

echo "=== [2/6] Configuring automatic security updates ==="
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "=== [3/6] Setting up UFW firewall ==="
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP (Caddy Let Encrypt challenge)'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
ufw status verbose

echo "=== [4/6] Installing official Docker Engine ==="
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
chmod a+r /etc/apt/keyrings/docker.gpg

UBUNTU_CODENAME="$(lsb_release -cs)"
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y --no-install-recommends \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

systemctl enable --now docker

echo "=== [5/6] Creating deployment user & directories ==="
DEPLOY_USER="fairhire"
DEPLOY_DIR="/opt/fairhire"

if ! id -u "${DEPLOY_USER}" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "${DEPLOY_USER}"
fi

usermod -aG docker "${DEPLOY_USER}"

mkdir -p "${DEPLOY_DIR}"
mkdir -p "${DEPLOY_DIR}/infra"
mkdir -p "${DEPLOY_DIR}/backups"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_DIR}"
chmod 750 "${DEPLOY_DIR}"

echo "=== [6/6] Hardening Docker daemon configuration ==="
cat << 'EOF' > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "no-new-privileges": true,
  "live-restore": true
}
EOF

systemctl restart docker

echo "=== Server bootstrap complete. FairHire deploy target ready at ${DEPLOY_DIR} ==="
