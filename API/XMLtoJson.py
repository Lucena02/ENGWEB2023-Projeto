import json
import xml.etree.ElementTree as ET
import re


def parseFiguras(corpo):
    figuras = []
    for fig in corpo.findall("./figura"):
        figId = fig.attrib["id"]
        imagem = {}
        img = fig.find("./imagem")
        path = img.attrib["path"]
        if "largura" in img.attrib:
            largura = img.attrib["largura"]
            img["largura"] = largura
        if path:
            imagem["path"] = path
        legenda = re.sub(r"\n\s*", "", fig.find("./legenda").text)
        figura = {"id": figId, "imagem": imagem, "legenda": legenda}
        figuras.append(figura)
    return figuras


def parseEntidade(ent):
    t = ent.text + ent.tail
    entidade = {}
    if "tipo" in ent.attrib:
        tipo = ent.attrib["tipo"]
        entidade["tipo"] = tipo
    entidade["nome"] = re.sub(r"\n\s*", "", ent.text)

    return entidade, t


def parseLugar(lug):
    t = lug.text + lug.tail
    nome = re.sub(r"\n\s*", "", lug.text)
    norm = None
    if "norm" in lug.attrib:
        norm = lug.arttrib["norm"]

    lugar = {"nome": nome, "norm": norm}

    return lugar, t


def parseData(dat):
    t = dat.text + dat.tail
    data = re.sub(r"\n\s*", "", dat.text)

    return data, t


def parseRefs(nodo):
    entidades = []
    lugares = []
    datas = []
    texto = ""

    for child in nodo:
        if child.tag == "entidade":
            entidade, t = parseEntidade(child)
            entidades.append(entidade)
            texto += t
        elif child.tag == "lugar":
            lugar, t = parseLugar(child)
            lugares.append(lugar)
            texto += t
        elif child.tag == "data":
            data, t = parseData(child)
            datas.append(data)
            texto += t
        else:
            print("Tag deve ser entidade, lugar ou data")

    refs = {"entidades": entidades, "lugares": lugares, "datas": datas}
    return refs, texto


def parseParagrafos(nodo):
    paragrafos = []
    for para in nodo.findall("./para"):
        refs, t = parseRefs(para)
        texto = str(para.text) + t
        texto = re.sub(r"\n\s*", "", texto)

        paragrafos.append({"refs": refs, "texto": texto})

    return paragrafos


def parseXML(xmlFile):
    objeto = {}
    tree = ET.parse(xmlFile)

    rua = tree.getroot()

    meta = rua.find("./meta")
    objeto["_id"] = re.sub(r"\n\s*", "", meta.find("./número").text)
    objeto["nome"] = re.sub(r"\n\s*", "", meta.find("./nome").text)

    corpo = rua.find("./corpo")

    objeto["figuras"] = parseFiguras(corpo)
    objeto["paragrafos"] = parseParagrafos(corpo)

    return objeto


def main():
    dataset = parseXML("../Dataset/texto/MRB-01-RuaDoCampo.xml")

    with open("../Dataset/dataset.json", "w") as jsonFile:
        json.dump(dataset, jsonFile, ensure_ascii=False)


if __name__ == "__main__":
    main()
