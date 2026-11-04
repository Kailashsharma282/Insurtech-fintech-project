import os

file_path = os.path.join('src', 'app', 'api', 'disease', 'predict', 'route.ts')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    } else if (uploadedFileBuffer) {
      // If a real image was uploaded, run python inference script if available
      try {
        const tmpPath = path.resolve('dataset_test', `temp_upload_${Date.now()}.jpg`);
        fs.writeFileSync(tmpPath, uploadedFileBuffer);
        const scriptPath = path.resolve('scripts', 'predict_leaf.py');
        const { stdout } = await execAsync(`python "${scriptPath}" "${tmpPath}"`, { timeout: 3500 });
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        const parsed = JSON.parse(stdout.trim().split('\\n').filter(l => l.startsWith('{') || l.startsWith('}') || l.includes('"')).join('\\n'));
        if (parsed.predictedClass && PROFILES[parsed.predictedClass]) {
          selected = PROFILES[parsed.predictedClass];
        }
      } catch (err) {
        // Fallback to healthy profile if inference process times out
        console.warn('Python inference fallback used:', err);
        selected = HEALTHY_PROFILE;
      }
    }"""

replacement = """    } else if (uploadedFileBuffer) {
      // If a real image was uploaded, run trained fast leaf classifier
      try {
        const uploadDir = path.resolve('tmp_uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const tmpPath = path.resolve(uploadDir, `temp_upload_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
        fs.writeFileSync(tmpPath, uploadedFileBuffer);
        
        const scriptPath = path.resolve('scripts', 'fast_leaf_predict.py');
        const { stdout } = await execAsync(`python "${scriptPath}" "${tmpPath}"`, { timeout: 15000 });
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        
        const lines = stdout.trim().split('\\n');
        const jsonStart = lines.findIndex(l => l.trim().startsWith('{'));
        const jsonEnd = lines.length - 1 - [...lines].reverse().findIndex(l => l.trim().endsWith('}'));
        const jsonStr = (jsonStart >= 0 && jsonEnd >= jsonStart) ? lines.slice(jsonStart, jsonEnd + 1).join('\\n') : stdout.trim();
        
        const parsed = JSON.parse(jsonStr);
        if (parsed.predictedClass && PROFILES[parsed.predictedClass]) {
          selected = { ...PROFILES[parsed.predictedClass] };
          if (parsed.confidence) selected.confidence = parsed.confidence;
          if (parsed.isGoodLeaf !== undefined) selected.isGoodLeaf = parsed.isGoodLeaf;
          if (parsed.biophysicalMetrics) {
            selected.biophysicalMetrics = {
              excessGreenIndex: parsed.biophysicalMetrics.excessGreenIndex,
              excessRedScorch: parsed.biophysicalMetrics.excessRedScorch,
              chlorophyllDominancePct: parsed.biophysicalMetrics.chlorophyllDominancePct,
              necrosisPct: parsed.biophysicalMetrics.necrosisPct
            };
          }
        }
      } catch (err) {
        console.warn('Fast leaf classifier fallback used:', err);
        selected = HEALTHY_PROFILE;
      }
    }"""

norm_content = content.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in norm_content, "Target not found in route.ts"
new_content = norm_content.replace(norm_target, norm_rep)

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_content)

print("SUCCESS: route.ts updated cleanly with fast leaf prediction wiring!")
