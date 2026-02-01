from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize WebDriver
driver = webdriver.Chrome()

# Open the React application
driver.get("http://localhost:5173/sign-in")

def wait_for_element(locator):
    """Wait for an element to be present in the DOM."""
    return WebDriverWait(driver, 15).until(
        EC.presence_of_element_located(locator)
    )

try:
    # Step 1: Perform Login
    print("Logging in...")
    wait_for_element((By.ID, 'email')).send_keys("jodie90sch@gmail.com")
    wait_for_element((By.ID, 'password')).send_keys("jodie90sch@gmail.com")
    wait_for_element((By.XPATH, "//button[text()='Sign In']")).click()
    print("Login successful!")

    # Step 2: Click Profile
    print("Clicking Profile...")
    profile_button = WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Profile"))
    )
    profile_button.click()
    print("Profile clicked!")

    # Step 3: Click Create Listing
    print("Clicking Create Listing...")
    create_listing_button = wait_for_element((By.XPATH, "//a[text()='Create Listing']"))
    create_listing_button.click()
    print("Create Listing clicked!")

    # Step 4: Fill Out Create Listing Form
    print("Filling out the Create Listing form...")
    
    # Input Name
    wait_for_element((By.ID, 'name')).send_keys("Test Car")
    print("Entered Name")

    # Input Description
    wait_for_element((By.ID, 'description')).send_keys("This is a test description.")
    print("Entered Description")

    # Input Location
    wait_for_element((By.ID, 'location')).send_keys("New York")
    print("Entered Location")

    # Input Color
    wait_for_element((By.ID, 'color')).send_keys("Red")
    print("Entered Color")

    # Input Model
    wait_for_element((By.ID, 'model')).send_keys("Model X")
    print("Entered Model")

    # Check "Drive To Malaysia" Checkbox
    drive_to_malaysia = wait_for_element((By.ID, 'driveToMalaysia'))
    if not drive_to_malaysia.is_selected():
        drive_to_malaysia.click()
    print("Checked 'Drive To Malaysia'")

    # Select Fuel Type Radio Button
    petrol_radio = driver.find_element(By.CSS_SELECTOR, 'input[id="fuelType"][value="petrol"]')
    if not petrol_radio.is_selected():
        petrol_radio.click()
    print("Selected 'Petrol' Fuel Type")

    # Input Min Age
    min_age = wait_for_element((By.ID, 'minAge'))
    min_age.clear()
    min_age.send_keys('25')
    print("Entered Minimum Age")

    # Input Pax
    pax = wait_for_element((By.ID, 'pax'))
    pax.clear()
    pax.send_keys('4')
    print("Entered Pax")

    # Input Regular Price
    regular_price = wait_for_element((By.ID, 'regularPrice'))
    regular_price.clear()
    regular_price.send_keys('1000')
    print("Entered Regular Price")

    # Check "Offer" Checkbox and Set Discount Price
    offer_checkbox = wait_for_element((By.ID, 'offer'))
    if not offer_checkbox.is_selected():
        offer_checkbox.click()
    discount_price = wait_for_element((By.ID, 'discountPrice'))
    discount_price.clear()
    discount_price.send_keys('800')
    print("Checked 'Offer' and entered Discount Price")

    # Click "Create Listing" Button
    wait_for_element((By.XPATH, "//button[text()='Create listing']")).click()
    print("Clicked 'Create Listing' button")

    # Step 5: Verify Successful Submission
    success_message = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'h1'))
    )
    print(f"Form submission successful: {success_message.text}")

except Exception as e:
    print(f"An error occurred during testing: {e}")
    driver.quit()
    raise
finally:
    driver.quit()
