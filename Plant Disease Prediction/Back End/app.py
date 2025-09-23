# dependencies

from utilities import makePrediction
import os
import traceback
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
        try:
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
            else:
                error_msg = "No image file provided"
                print(f"Error: {error_msg}")
                return jsonify({
                    'error': error_msg,
                    'status': 'error'
                }), 400
        
        except Exception as e:
            error_msg = f"Prediction failed: {str(e)}"
            print(f"Error: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            
            return jsonify({
                'error': error_msg,
                'status': 'error'
            }), 500

    
    return render_template("index.html", data="Please upload an image")


if __name__ == "__main__":
    app.run(debug=True,port=38000)
