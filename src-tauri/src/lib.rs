use serde::{Deserialize, Serialize};
use std::env;
use std::path::PathBuf;
use tokio::process::Command as TokioCommand;

fn tools_dir() -> PathBuf {
    let exe = env::current_exe().unwrap();
    exe.parent().unwrap().join("tools")
}

fn image_compressor_path() -> PathBuf {
    tools_dir().join("image_compressor.exe")
}

fn video_converter_path() -> PathBuf {
    tools_dir().join("video_converter.exe")
}

#[derive(Serialize, Deserialize)]
pub struct CompressResult {
    pub src: String,
    pub dest: String,
    pub size_before: u64,
    pub size_after: u64,
}

#[tauri::command]
async fn compress_image(
    src_path: String,
    dest_dir: String,
    format: String,
    quality: u32,
) -> Result<CompressResult, String> {
    use std::process::Command as StdCommand;

    let src = std::path::PathBuf::from(&src_path);
    let file_stem = src
        .file_stem()
        .ok_or("Invalid file name")?
        .to_string_lossy()
        .to_string();

    let dest_path = std::path::PathBuf::from(&dest_dir).join(format!("{file_stem}.{format}"));
    let dest_path_str = dest_path.to_str().ok_or("Invalid dest path")?.to_string();

    let compressor = image_compressor_path();

    let output = StdCommand::new(compressor)
        .arg(&src_path)
        .arg(&dest_path_str)
        .arg(&format)
        .arg(quality.to_string())
        .output()
        .map_err(|e| format!("Failed to run image_compressor: {e}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout);

    if !output.status.success() {
        return Err(stdout.to_string());
    }

    let result: CompressResult = serde_json::from_str(&stdout)
        .map_err(|e| format!("Invalid JSON from image_compressor: {e} | {stdout}"))?;

    Ok(result)
}

#[derive(Serialize, Deserialize)]
pub struct VideoResult {
    pub src: String,
    pub dest: String,
    pub size_before: u64,
    pub size_after: u64,
}

#[tauri::command]
async fn convert_video(
    src: String,
    dest_path: String,
    fmt: String,
    res: String,
) -> Result<VideoResult, String> {
    let converter = video_converter_path();

    let output = TokioCommand::new(converter)
        .arg(&src)
        .arg(&dest_path)
        .arg(&fmt)
        .arg(&res)
        .output()
        .await
        .map_err(|e| format!("Failed to run video_converter: {e}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    println!("=== video_converter stdout ===\n{stdout}\n=== END ===");
    println!("=== video_converter stderr ===\n{stderr}\n=== END ===");

    if !output.status.success() {
        return Err(format!(
            "video_converter failed. status: {status}, stdout: {stdout}, stderr: {stderr}",
            status = output.status
        ));
    }

    let json_line = stdout
        .lines()
        .filter(|l| !l.trim().is_empty())
        .last()
        .ok_or_else(|| format!("No JSON output from video_converter | stdout: {stdout}"))?;

    let result: VideoResult = serde_json::from_str(json_line)
        .map_err(|e| format!("Invalid JSON from video_converter: {e} | {json_line}"))?;

    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![compress_image, convert_video,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
