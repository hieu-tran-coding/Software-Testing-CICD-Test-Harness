-- Dùng ảnh PNG khi biên dịch LaTeX vì XeLaTeX không đọc trực tiếp SVG/WebP.
local replacements = {
  ["images/How-Does-a-Test-Harness-Work.webp"] = "images/How-Does-a-Test-Harness-Work.png",
  ["images/system-architecture.svg"] = "images/system-architecture.png",
  ["images/github-actions-workflow.svg"] = "images/github-actions-workflow.png",
  ["images/jenkins-pipeline-workflow.svg"] = "images/jenkins-pipeline-workflow.png"
}

function Image(image)
  if replacements[image.src] then
    image.src = replacements[image.src]
  end

  -- Markdown giữ số hình để đọc độc lập; LaTeX tự đánh số nên bỏ tiền tố này.
  local caption = pandoc.utils.stringify(image.caption)
  local shortened = caption:gsub("^Hình%s+%d+%.%s*", "")
  if shortened ~= caption then
    local parsed = pandoc.read(shortened, "markdown")
    if parsed.blocks[1] and parsed.blocks[1].content then
      image.caption = parsed.blocks[1].content
    end
  end

  return image
end

function Figure(figure)
  local caption = pandoc.utils.stringify(figure.caption)
  local shortened = caption:gsub("^Hình%s+%d+%.%s*", "")
  if shortened ~= caption then
    figure.caption.long = pandoc.read(shortened, "markdown").blocks
  end
  return figure
end

function Table(tbl)
  local columns = #tbl.colspecs
  local widths
  local heading = pandoc.utils.stringify(tbl.head)

  if columns == 2 then
    widths = {0.32, 0.68}
  elseif columns == 3 then
    if heading:match("MSSV") then
      widths = {0.25, 0.14, 0.61}
    elseif heading:match("Dấu hiệu") then
      widths = {0.20, 0.40, 0.40}
    else
      widths = {0.24, 0.32, 0.44}
    end
  elseif columns == 4 then
    widths = {0.20, 0.20, 0.20, 0.40}
  elseif columns == 5 then
    widths = {0.17, 0.17, 0.17, 0.17, 0.32}
  else
    widths = {}
    for index = 1, columns do
      widths[index] = 1 / columns
    end
  end

  for index, colspec in ipairs(tbl.colspecs) do
    colspec[2] = widths[index]
    tbl.colspecs[index] = colspec
  end

  return tbl
end
