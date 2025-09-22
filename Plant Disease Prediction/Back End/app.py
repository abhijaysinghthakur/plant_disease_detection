# dependencies

from utilities import makePrediction
import os
from flask import Flask,request,render_template,jsonify
from flask_cors import CORS
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app)  # Enable CORS for all routes

IMAGE_FOLDER = os.getcwd() + "/static"

@app.route("/",methods = ["GET","POST"])
def index():
    return render_template("index.html",data = "Hey there!!")

@app.route("/predict",methods = ["POST","GET"])
def predict():
    if request.method == "POST":
        img = request.files["img"]

        if img:
            img_loc = os.path.join(
                IMAGE_FOLDER,
                img.filename
            )
            img.save(img_loc)

            prediction = makePrediction(img_loc)
            
            # Check if request wants JSON response (from React app)
            if request.headers.get('Content-Type') == 'multipart/form-data' or 'application/json' in request.headers.get('Accept', ''):
                return jsonify({
                    'prediction': prediction,
                    'image_url': img.filename
                })
            
            # Return JSON response for API calls
            if request.headers.get('Content-Type') == 'application/json' or request.headers.get('Accept') == 'application/json':
                return jsonify({
                    'data': prediction,
                    'image_filename': img.filename,
                    'status': 'success'
                })
            
            # Return HTML template for web interface
            return render_template("index.html", data=prediction, image_loc=img.filename)

            # Return HTML template for direct browser access
            return render_template("index.html", data=prediction, image_loc=img.filename)
    
    return render_template("index.html", data="Please upload an image")


if __name__ == "__main__":
    app.run(debug=True,port=38000)
