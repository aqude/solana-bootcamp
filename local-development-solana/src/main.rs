use clap::Parser;
use std::process::{Command, Stdio};
const _PATH_TO_CONFIG: &str = "/etc/local-development-solana/config.toml";
const _SITES: [&str; 2] = ["http://localhost:3000", "https://explorer.solana.com"];

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// full path to frontend folder
    #[arg(long)]
    frontend_folder: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Args = Args::parse();
    let command_frontend: String = format!("wsl -e sh -c cd {} && npm i && npm run dev", &args.frontend_folder);
     //         --frontend-folder /home/aqude/projects/bootcamp-solana/voting-validation-app
    // start frontend
    command(&command_frontend);
    // start validator
    command("solana-test-validator");
    // pen urls
    for url in _SITES {
        open::that(url)?
    }
    Ok(())
}

fn command(command: &str) {
    let mut cmd: Command;
        if cfg!(target_os = "windows") {
            cmd = Command::new("cmd");
            cmd.arg("/C").arg(command)
        } else {
            cmd = Command::new("gnome-terminal");
            cmd.args(["--", "sh", "-c", command])
        };
    let output = cmd
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .spawn()
            .expect("Failed to execute command")
            .wait()
            .expect("Command wasn't running");
    
        if output.success() {
            println!("Command executed successfully!");
        } else {
            eprintln!("Command failed with status: {:?}", output.code());
        }
    
}
