# dependencies

from utilities import makePrediction
import os
from flask import Flask,request,render_template,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
            
            # Return JSON response for API calls
            if 'application/json' in request.headers.get('Accept', '') or request.is_json:
                return jsonify({
                    'prediction': prediction,
                    'image_url': img.filename,
                    'status': 'success'
                })
            
            # Return HTML template for web interface
            return render_template("index.html", data=prediction, image_loc=img.filename)

    
    return render_template("index.html", data="Please upload an image")


if __name__ == "__main__":
    app.run(debug=True,port=38000)
