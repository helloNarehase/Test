from flask import Flask, request, jsonify, send_file
from PIL import Image
from flask_cors import CORS

img = None
app = Flask(__name__)
CORS(app)
@app.route('/api/convert', methods=['POST'])
def convert_to_grayscale():
    global img
    file = request.files['image']
    image = Image.open(file)
    grayscale_image = image.convert('L')
    grayscale_image.save('converted_image.jpg')
    img = grayscale_image
    return jsonify({'message': 'Image converted to grayscale', 'image_path': 'converted_image.jpg'})

@app.route('/converted_image.jpg', methods=['GET'])
def get_converted_image():
    image_path = 'blog\\converted_image.jpg'
    return send_file(image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)