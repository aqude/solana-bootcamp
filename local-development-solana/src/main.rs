use clap::Parser;
use std::io::Read;
use std::thread::{self, spawn};
use std::process::{Command, Stdio};
use std::time;
use std::env;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// full path to frontend folder
    #[arg(long)]
    frontend_folder: String,
    /// full path to solana-test-validator executable file or use default path
    #[arg(long, default_value_t = default_validator_path())]
    solana_validator: String,
}

fn default_validator_path() -> String {
    if cfg!(target_os = "windows") {
        let formatted_command = format!("wsl -d Debian -e sh -c 'USER=$USER echo $USER'");
        let mut cmd = Command::new("powershell")
        .args(["/C", &formatted_command])
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn().expect("command \"GET USERNAME\" wasn't spawn");

        let mut user = String::new();
        if let Some(mut stdout) = cmd.stdout.take() {
            let _ = stdout.read_to_string(&mut user).expect("Failed to read stdout");
        }
        user = user.trim().replace(" ", "");
        format!("/home/{}/.local/share/solana/install/active_release/bin/solana-test-validator", user)
    } else {
        let user = env::var("USER").expect("USER environment variable not found");
        format!("/home/{}/.local/share/solana/install/active_release/bin/solana-test-validator", user)
    }

}
fn main() -> Result<(), Box<dyn std::error::Error>> {
    const _PATH_TO_CONFIG: &str = "/etc/local-development-solana/config.toml";
    const _SITES: [&str; 2] = ["http://localhost:3000", "https://explorer.solana.com"];
    let args: Args = Args::parse();
    let command_frontend: String = format!("cd '{}' && npm i && npm run dev", &args.frontend_folder);
    let command_solana = format!("cd ~/ && {}", &args.solana_validator);
     let handle_one = spawn(move || {
        let _ = command(&command_frontend);
    });
    let handle_two = spawn(move || {
        let _ = command(&command_solana);
    });
    let handle_three = spawn(|| {
        let _ = link_opener(&_SITES);
    });
  
    handle_one.join().expect("Task one panicked");
    handle_two.join().expect("Task two panicked");
    handle_three.join().expect("Task three panicked");
    command("/home/aqude/.local/share/solana/install/active_release/bin/solana-test-validator")?;
    
    Ok(())

}

fn link_opener(links: &[&str]) -> Result<(), Box<dyn std::error::Error>> {
    let millis = time::Duration::from_millis(10000);
    thread::sleep(millis);
    for url in links {
        open::that(url)?
    }

    Ok(())
}

fn command(command: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut cmd: Command;

    if cfg!(target_os = "windows") {
        let formatted_command = format!("wsl -d Debian -e sh -c \"{}\"", command);
        cmd = Command::new("powershell");
        cmd.args(["/C", &formatted_command])
    } else {
        cmd = Command::new("sh");
        cmd.args([&command])
    };

    let output = cmd
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .spawn()?
            .wait()?;
    
    if output.success() {
        println!("Command executed successfully!");
    } else {
        eprintln!("Command failed with status: {:?}", output.code());
    }

    Ok(())
}
