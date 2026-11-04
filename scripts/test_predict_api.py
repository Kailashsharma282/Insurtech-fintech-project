import urllib.request
import json
import io
import os

# Test 1: Condition = dry
req = urllib.request.Request(
    'http://localhost:3000/api/disease/predict',
    data=json.dumps({'condition': 'bad_dry_wilted'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read().decode('utf-8'))
print('Condition dry result:')
print('  Disease:', data['data']['disease'])
print('  isGoodLeaf:', data['data']['isGoodLeaf'])
print('  Water Status:', data['data']['waterRequirement']['statusBadge'])
print('  Urgency:', data['data']['waterRequirement']['urgency'])
print('  Moisture:', data['data']['waterRequirement']['estimatedSoilMoisturePct'])
print('  Irrigation Action:', data['data']['waterRequirement']['irrigationAction'][:80])

# Test 2: Upload real dry leaf image file via multipart form
img_path = os.path.join('public', 'samples', 'leaves', 'dry_wilted_leaf_1.jpg')
with open(img_path, 'rb') as f:
    img_bytes = f.read()

boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = io.BytesIO()
body.write(f'--{boundary}\r\n'.encode('utf-8'))
body.write(b'Content-Disposition: form-data; name="image"; filename="dry_wilted_leaf_1.jpg"\r\n')
body.write(b'Content-Type: image/jpeg\r\n\r\n')
body.write(img_bytes)
body.write(b'\r\n')
body.write(f'--{boundary}--\r\n'.encode('utf-8'))

req_upload = urllib.request.Request(
    'http://localhost:3000/api/disease/predict',
    data=body.getvalue(),
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)
resp_upload = urllib.request.urlopen(req_upload)
data_upload = json.loads(resp_upload.read().decode('utf-8'))
print('\nReal File Upload Result (fast_leaf_predict):')
print('  Disease:', data_upload['data']['disease'])
print('  isGoodLeaf:', data_upload['data']['isGoodLeaf'])
print('  Confidence:', data_upload['data']['confidence'])
print('  Water Status:', data_upload['data']['waterRequirement']['statusBadge'])
print('  Urgency:', data_upload['data']['waterRequirement']['urgency'])
print('  Moisture:', data_upload['data']['waterRequirement']['estimatedSoilMoisturePct'])
print('  Biophysical Metrics:', data_upload['data']['biophysicalMetrics'])
