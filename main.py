from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import shutil

app = FastAPI()

app.mount("/mint_pages", StaticFiles(directory="mint_pages"), name="mint_pages")

MINT_PAGES_FOLDER = "mint_pages"
TEMPLATES_FOLDER = "templates"
REACT_APP_TEMPLATE_BUILD_FOLDER = "mint-page-template/build/static"

@app.post("/create-page")
async def create_page(
    request: Request,
    client: str = Form(...),
    collection_name: str = Form(...),
    landing_page_title: str = Form(...),
    landing_page_description: str = Form(...),
    banner_image: UploadFile = File(...),
    pass_image: UploadFile = File(...)
):
    client_folder = MINT_PAGES_FOLDER + f"/{client}/{collection_name}"
    
    # Copy the static files (css and js) from template build folder to the client folder
    shutil.copytree(REACT_APP_TEMPLATE_BUILD_FOLDER, client_folder)

    # Save the banner image
    banner_image_path = f"{client_folder}/banner_image.{banner_image.filename.split('.')[-1]}"
    with open(banner_image_path, "wb") as buffer:
        shutil.copyfileobj(banner_image.file, buffer)

    # Save the pass image (this will change, passimage is fetcheh via javascript)
    pass_image_path = f"{client_folder}/pass_image.{pass_image.filename.split('.')[-1]}"
    with open(pass_image_path, "wb") as buffer:
        shutil.copyfileobj(pass_image.file, buffer)

    mint_page = f"{client_folder}/mint.html"

    page_template_file = TEMPLATES_FOLDER + "/index.html"
    # Read the index.html template content
    with open(page_template_file, "r") as file:
        template_content = file.read()

    # Inject the client's properties into the template_content
    injected_content = template_content
    injected_content = injected_content.replace("{{title}}", landing_page_title)
    injected_content = injected_content.replace("{{description}}", landing_page_description)
    injected_content = injected_content.replace("{{bannerImageUrl}}", f"banner_image.{banner_image.filename.split('.')[-1]}")
    injected_content = injected_content.replace("{{passUrl}}", f"pass_image.{pass_image.filename.split('.')[-1]}")

    # Save the injected content as a static HTML file with the unique URL
    with open(mint_page, "w") as file:
        file.write(injected_content)

    # Return the unique URL to the client
    return JSONResponse({"url": mint_page})
