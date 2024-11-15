from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize WebDriver (Ensure that ChromeDriver is installed and in PATH)
driver = webdriver.Chrome()

# Open the React application (Replace 'http://localhost:3000' with your app URL)
driver.get("http://localhost:3000/create-listing")

# Function to wait for an element to be present
def wait_for_element(locator):
    return WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(locator)
    )

try:
    # Test 1: Verify Required Fields
    wait_for_element((By.ID, 'name')).send_keys("Test Car")
    wait_for_element((By.ID, 'description')).send_keys("This is a test description.")
    wait_for_element((By.ID, 'location')).send_keys("New York")
    wait_for_element((By.ID, 'color')).send_keys("Red")
    wait_for_element((By.ID, 'model')).send_keys("Model X")
    
    # Check "Drive To Malaysia" checkbox
    driver.find_element(By.ID, 'driveToMalaysia').click()

    # Select Fuel Type Radio Button
    petrol_radio = driver.find_element(By.CSS_SELECTOR, 'input[id="fuelType"][value="petrol"]')
    if not petrol_radio.is_selected():
        petrol_radio.click()
    
    # Set Min Age
    min_age = driver.find_element(By.ID, 'minAge')
    min_age.clear()
    min_age.send_keys('25')
    
    # Set Pax
    pax = driver.find_element(By.ID, 'pax')
    pax.clear()
    pax.send_keys('4')
    
    # Set Regular Price
    regular_price = driver.find_element(By.ID, 'regularPrice')
    regular_price.clear()
    regular_price.send_keys('1000')

    # Check the "Offer" checkbox and set Discount Price
    offer_checkbox = driver.find_element(By.ID, 'offer')
    offer_checkbox.click()
    discount_price = driver.find_element(By.ID, 'discountPrice')
    discount_price.clear()
    discount_price.send_keys('800')

    # Click on Create Listing
    driver.find_element(By.XPATH, "//button[text()='Create listing']").click()

    # Wait for navigation to the new listing page or success message
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'h1'))
    )

    print("Form submission test passed successfully!")

except Exception as e:
    print("An error occurred during testing:", e)

finally:
    # Close the browser
    driver.quit()
