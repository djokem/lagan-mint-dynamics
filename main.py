from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://learn-heroes-mounts-belfast.trycloudflare.com",  # Replace with the origin you are making requests from
    # other origins you wish to allow
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # banner_image: UploadFile = File(...),
    # pass_image: UploadFile = File(...),
    contract_address: str = Form(...)
):
    client_folder = MINT_PAGES_FOLDER + f"/{client}/{collection_name}"
    
    # Copy the static files (css and js) from template build folder to the client folder
    shutil.copytree(REACT_APP_TEMPLATE_BUILD_FOLDER, client_folder)

    banner_template_image_path = "./templates/banner.jpeg"
    pass_template_image_path = "./templates/pass.avif"

    # Save the banner image
    banner_image_path = f"{client_folder}/banner_image.{banner_template_image_path.split('.')[-1]}"
    with open(banner_template_image_path, "rb") as source, open(banner_image_path, "wb") as buffer:
        shutil.copyfileobj(source, buffer)

    # Save the pass image (this will change, passimage is fetcheh via javascript)
    pass_image_path = f"{client_folder}/pass_image.{pass_template_image_path.split('.')[-1]}"
    with open(pass_template_image_path, "rb") as source, open(pass_image_path, "wb") as buffer:
        shutil.copyfileobj(source, buffer)

    mint_page = f"{client_folder}/mint.html"

    page_template_file = TEMPLATES_FOLDER + "/index.html"
    # Read the index.html template content
    with open(page_template_file, "r") as file:
        template_content = file.read()

    # Inject the client's properties into the template_content
    injected_content = template_content
    injected_content = injected_content.replace("{{title}}", landing_page_title)
    injected_content = injected_content.replace("{{description}}", landing_page_description)
    injected_content = injected_content.replace("{{bannerImageUrl}}", f"banner_image.{banner_template_image_path.split('.')[-1]}")
    injected_content = injected_content.replace("{{passUrl}}", f"pass_image.{pass_template_image_path.split('.')[-1]}")
    injected_content = injected_content.replace("{{contractAddress}}", contract_address)
    
    # Save the injected content as a static HTML file with the unique URL
    with open(mint_page, "w") as file:
        file.write(injected_content)

    # Return the unique URL to the client
    return JSONResponse({"url": mint_page})
