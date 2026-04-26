import logging
import asyncio
from typing import Optional, Dict, Any, List
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

class BrowserService:
    def __init__(self):
        self.pw = None
        self.browser = None
        self.context = None

    async def start(self):
        if not self.pw:
            self.pw = await async_playwright().start()
            self.browser = await self.pw.chromium.launch(headless=True)
            self.context = await self.browser.new_context(
                viewport={"width": 1280, "height": 720},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            )

    async def stop(self):
        if self.browser:
            await self.browser.close()
        if self.pw:
            await self.pw.stop()

    async def open_and_fill(self, url: str, fields: Dict[str, str], submit_selector: Optional[str] = None) -> Dict[str, Any]:
        """Opens a URL, fills fields, and optionally submits."""
        await self.start()
        page = await self.context.new_page()
        try:
            logger.info(f"Navigating to {url}")
            await page.goto(url, wait_until="networkidle", timeout=60000)
            
            for selector, value in fields.items():
                logger.info(f"Filling {selector} with {value}")
                await page.fill(selector, value)
            
            if submit_selector:
                logger.info(f"Clicking {submit_selector}")
                await page.click(submit_selector)
                await page.wait_for_load_state("networkidle")

            title = await page.title()
            final_url = page.url
            return {
                "status": "success",
                "title": title,
                "final_url": final_url,
                "message": f"Successfully interacted with {url}"
            }
        except Exception as e:
            logger.error(f"Browser action failed: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            await page.close()

    async def search_and_extract(self, url: str, selectors: Dict[str, str]) -> Dict[str, Any]:
        """Opens a URL and extracts text from given selectors."""
        await self.start()
        page = await self.context.new_page()
        try:
            await page.goto(url, wait_until="networkidle")
            results = {}
            for key, selector in selectors.items():
                try:
                    element = await page.wait_for_selector(selector, timeout=5000)
                    results[key] = await element.inner_text()
                except:
                    results[key] = None
            return {"status": "success", "data": results}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            await page.close()

    async def search_buses(self, from_city: str, to_city: str, date: str = "") -> Dict[str, Any]:
        """Search for buses on RedBus and extract available options."""
        await self.start()
        page = await self.context.new_page()
        try:
            url = f"https://www.redbus.in/bus-tickets/{from_city.replace(' ', '-')}-to-{to_city.replace(' ', '-')}"
            logger.info(f"Searching buses: {url}")
            await page.goto(url, wait_until="networkidle", timeout=30000)

            # Wait for bus results to load
            await page.wait_for_timeout(3000)

            # Extract bus listings
            buses = []
            bus_items = await page.query_selector_all(".bus-item, .bus-card, [data-testid='bus-item'], .route-section .bus-item")
            
            for i, item in enumerate(bus_items[:5]):  # Top 5 results
                bus_info = {}
                try:
                    name_el = await item.query_selector(".travels-name, .bus-name, [data-testid='travels-name']")
                    if name_el:
                        bus_info["name"] = await name_el.inner_text()
                    
                    dep_el = await item.query_selector(".dep-time, .departure-time, [data-testid='departure-time']")
                    if dep_el:
                        bus_info["departure"] = await dep_el.inner_text()
                    
                    arr_el = await item.query_selector(".arr-time, .arrival-time, [data-testid='arrival-time']")
                    if arr_el:
                        bus_info["arrival"] = await arr_el.inner_text()
                    
                    price_el = await item.query_selector(".fare, .price, .bus-fare, [data-testid='fare']")
                    if price_el:
                        bus_info["price"] = await price_el.inner_text()
                    
                    seats_el = await item.query_selector(".seat-count, .available-seats")
                    if seats_el:
                        bus_info["seats_available"] = await seats_el.inner_text()
                    
                    boarding_el = await item.query_selector(".boarding-point, .bp-text")
                    if boarding_el:
                        bus_info["boarding_point"] = await boarding_el.inner_text()
                    
                    dropping_el = await item.query_selector(".dropping-point, .dp-text")
                    if dropping_el:
                        bus_info["dropping_point"] = await dropping_el.inner_text()

                    if bus_info:
                        buses.append(bus_info)
                except Exception as e:
                    logger.warning(f"Failed to extract bus item {i}: {e}")

            return {
                "status": "success" if buses else "no_results",
                "buses": buses,
                "from": from_city,
                "to": to_city,
                "count": len(buses),
                "url": url,
            }
        except Exception as e:
            logger.error(f"Bus search failed: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            await page.close()

    async def book_item(self, url: str, fields: Dict[str, str], confirm_selector: str = "", user_details: Dict[str, str] = None) -> Dict[str, Any]:
        """Execute a booking on a website (bus, train, appointment) with user details."""
        await self.start()
        page = await self.context.new_page()
        try:
            logger.info(f"Booking at {url}")
            await page.goto(url, wait_until="networkidle", timeout=60000)

            # Fill search/booking fields
            for selector, value in fields.items():
                try:
                    await page.fill(selector, value)
                except Exception as e:
                    logger.warning(f"Could not fill {selector}: {e}")

            # Fill user details if provided
            if user_details:
                for selector, value in user_details.items():
                    try:
                        await page.fill(selector, value)
                    except Exception as e:
                        logger.warning(f"Could not fill user detail {selector}: {e}")

            # Click confirm/pay button
            if confirm_selector:
                await page.click(confirm_selector)
                await page.wait_for_load_state("networkidle")

            title = await page.title()
            final_url = page.url
            
            # Try to extract confirmation details
            confirmation = {}
            try:
                conf_el = await page.query_selector(".confirmation, .booking-confirmed, .success-msg, [data-testid='confirmation']")
                if conf_el:
                    confirmation["message"] = await conf_el.inner_text()
                pnr_el = await page.query_selector(".pnr, .booking-id, .reference-number")
                if pnr_el:
                    confirmation["pnr"] = await pnr_el.inner_text()
            except:
                pass

            return {
                "status": "success",
                "title": title,
                "final_url": final_url,
                "confirmation": confirmation if confirmation else "Booking submitted. Check your phone for details.",
            }
        except Exception as e:
            logger.error(f"Booking failed: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            await page.close()

    async def extract_page_text(self, url: str, wait_seconds: int = 3) -> Dict[str, Any]:
        """Open a URL and extract all visible text content (for AI processing)."""
        await self.start()
        page = await self.context.new_page()
        try:
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(wait_seconds * 1000)
            
            body_text = await page.inner_text("body")
            title = await page.title()
            
            return {
                "status": "success",
                "title": title,
                "text": body_text[:5000],  # Limit for AI processing
                "url": url,
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            await page.close()


_browser_instance = None

async def get_browser_service():
    global _browser_instance
    if not _browser_instance:
        _browser_instance = BrowserService()
        await _browser_instance.start()
    return _browser_instance
