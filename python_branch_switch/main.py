from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.post("/switch")
def switch_branch():
    branch = request.json.get("branch")
    cmds = [
        "cd /var/www/proje && git fetch --all",
        f"cd /var/www/proje && git checkout {branch}",
        f"cd /var/www/proje && git reset --hard origin/{branch}",
        "cd /var/www/proje && pm2 restart proje"
    ]
    for cmd in cmds:
        subprocess.run(cmd, shell=True)
    return {"status": "ok", "branch": branch}

app.run(host="0.0.0.0", port=5000)
